import axios from 'axios';

// VITE_API_URL est défini dans .env (voir .env.example) — évite de coder
// l'URL du backend en dur, pratique pour passer de local à un déploiement.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
});

// Attache automatiquement le token sur chaque requête si présent —
// évite de le répéter manuellement dans chaque appel.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si le token est expiré/invalide (401), on déconnecte proprement plutôt
// que de laisser l'app dans un état incohérent avec un token mort en mémoire.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);
