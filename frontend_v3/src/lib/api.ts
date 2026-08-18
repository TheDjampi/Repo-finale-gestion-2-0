import axios, { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';
import type { TokenResponse } from '../types/api';

// VITE_API_URL est défini dans .env (voir .env.example) — évite de coder
// l'URL du backend en dur, pratique pour passer de local à un déploiement.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
});

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

type PendingRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let pendingRequests: PendingRequest[] = [];

export function setTokens(access: string | null, refresh: string | null) {
  if (access) {
    localStorage.setItem('access_token', access);
  } else {
    localStorage.removeItem('access_token');
  }

  if (refresh) {
    localStorage.setItem('refresh_token', refresh);
  } else {
    localStorage.removeItem('refresh_token');
  }
}

export function getAccessToken(): string | null {
  return localStorage.getItem('access_token');
}

function getRefreshToken(): string | null {
  return localStorage.getItem('refresh_token');
}

function processPendingRequests(error: unknown, token: string | null) {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (token) {
      resolve(token);
      return;
    }
    reject(error);
  });
  pendingRequests = [];
}

function setAuthorizationHeader(config: InternalAxiosRequestConfig, accessToken: string) {
  const authorizationValue = 'Bearer '.concat(accessToken);

  if (config.headers instanceof AxiosHeaders) {
    config.headers.set('Authorization', authorizationValue);
    return;
  }

  if (!config.headers) {
    config.headers = new AxiosHeaders();
    config.headers.set('Authorization', authorizationValue);
    return;
  }

  (config.headers as Record<string, string>).Authorization = authorizationValue;
}

export function logoutAndRedirect() {
  setTokens(null, null);
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

// Attache automatiquement le token sur chaque requête si présent —
// évite de le répéter manuellement dans chaque appel.
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    setAuthorizationHeader(config, token);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes('/auth/refresh') || originalRequest._retry) {
      logoutAndRedirect();
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      logoutAndRedirect();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        pendingRequests.push({ resolve, reject });
      }).then((newAccessToken) => {
        setAuthorizationHeader(originalRequest, newAccessToken);
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post<TokenResponse>(
        `${api.defaults.baseURL}/auth/refresh`,
        { refresh_token: refreshToken }
      );

      setTokens(data.access_token, data.refresh_token);
      processPendingRequests(null, data.access_token);

      setAuthorizationHeader(originalRequest, data.access_token);
      return api(originalRequest);
    } catch (refreshError) {
      processPendingRequests(refreshError, null);
      logoutAndRedirect();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
