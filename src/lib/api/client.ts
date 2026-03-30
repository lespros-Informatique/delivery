/**
 * API Client – Axios Configuration
 * ==========================================
 * Centralized HTTP client for all API requests.
 *
 * Security model:
 * - Authentication is handled exclusively via HTTP-only cookies (set by server).
 * - NO token is read from or written to localStorage here.
 * - `withCredentials: true` ensures cookies are sent on every cross-origin request.
 * - A 401 interceptor attempts a silent token refresh before failing.
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authService } from './auth';

// ─── Base URL ────────────────────────────────────────────────────────────────

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// ─── Axios Instance ──────────────────────────────────────────────────────────

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 s – réduit de 30 s pour meilleur feedback utilisateur
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Envoie les cookies HTTP-only automatiquement
});

// ─── Request Interceptor ─────────────────────────────────────────────────────
// Aucune injection de token : les cookies sont transportés automatiquement.
// Cet intercepteur sert uniquement à propager les erreurs réseau proprement.

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error)
);

// ─── Response Interceptor – Refresh silencieux 401 ──────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const url = originalRequest?.url ?? '';

    // Ne pas relancer le refresh sur les endpoints d'auth (évite les boucles)
    const isAuthEndpoint =
      url.includes('/auth/login') ||
      url.includes('/auth/refresh') ||
      url.includes('/auth/register');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await authService.refresh();

        if (refreshResponse.success && refreshResponse.data) {
          // Met à jour l'utilisateur stocké pour l'UI
          authService.setCurrentUser(refreshResponse.data.user);
          // Relance la requête initiale (le nouveau cookie est déjà positionné)
          return apiClient(originalRequest);
        }
      } catch {
        // Refresh échoué → déconnexion propre
        authService.clearCurrentUser();
        window.location.href = '/delivery/login';
      }
    }

    // Log detailed error for debugging (400, 422, 500)
    if (error.response) {
      console.error(`[API Error] ${error.response.status} ${url}:`, error.response.data);
    } else {
      console.error(`[API Error] ${url}:`, error.message);
    }

    return Promise.reject(error);
  }
);

// ─── Shared Response Types ───────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  errors?: Array<{
    path: string;
    message: string;
  }>;
}

export { apiClient };
export default apiClient;