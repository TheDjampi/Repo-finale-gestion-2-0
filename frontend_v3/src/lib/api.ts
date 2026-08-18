import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import type { TokenResponse } from '../types/api';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

let accessToken: string | null = localStorage.getItem(ACCESS_TOKEN_KEY);
let refreshToken: string | null = localStorage.getItem(REFRESH_TOKEN_KEY);

export function setTokens(access: string | null, refresh: string | null) {
  accessToken = access;
  refreshToken = refresh;

  if (access) {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  if (refresh) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export function getAccessToken(): string | null {
  return accessToken;
}

function getRefreshToken(): string | null {
  return refreshToken;
}

function logoutAndRedirect() {
  setTokens(null, null);
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

// VITE_API_URL est défini dans .env (voir .env.example) — évite de coder
// l'URL du backend en dur, pratique pour passer de local à un déploiement.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
});

// Attache automatiquement le token sur chaque requête si présent —
// évite de le répéter manuellement dans chaque appel.
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };
type QueueSubscriber = (token: string | null) => void;

let isRefreshing = false;
let refreshQueue: QueueSubscriber[] = [];

function subscribeTokenRefresh(callback: QueueSubscriber) {
  refreshQueue.push(callback);
}

function flushRefreshQueue(token: string | null) {
  refreshQueue.forEach((callback) => callback(token));
  refreshQueue = [];
}

// Si le token est expiré/invalide (401), on tente d'abord un refresh.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;

    if (status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url ?? '';
    const isAuthFlowRequest = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/refresh');

    if (isAuthFlowRequest || originalRequest._retry) {
      if (requestUrl.includes('/auth/refresh')) {
        logoutAndRedirect();
      }
      return Promise.reject(error);
    }

    const currentRefreshToken = getRefreshToken();
    if (!currentRefreshToken) {
      logoutAndRedirect();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((newAccessToken) => {
          if (!newAccessToken) {
            reject(error);
            return;
          }
          originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;
          resolve(api(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post<TokenResponse>(`${api.defaults.baseURL}/auth/refresh`, {
        refresh_token: currentRefreshToken,
      });

      setTokens(data.access_token, data.refresh_token);
      flushRefreshQueue(data.access_token);

      originalRequest.headers.Authorization = 'Bearer ' + data.access_token;
      return api(originalRequest);
    } catch (refreshError) {
      flushRefreshQueue(null);
      logoutAndRedirect();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
