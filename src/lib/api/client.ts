/**
 * API Client - Axios Configuration
 * ==========================================
 * Centralized API client for all HTTP requests
 * 
 * Security: Uses HTTP-only cookies for authentication
 * but also supports Authorization header for backward compatibility
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authService } from './auth';

// Base URL - Change this to your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important: enables cookies with cross-origin requests
});

// Request interceptor - Add auth token (optional - cookies are primary)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Try to get token from localStorage for backward compatibility
    // Note: Primary auth is handled via HTTP-only cookies
    const token = localStorage.getItem('woli_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const url = originalRequest?.url || '';

    // Skip token refresh for auth endpoints to avoid infinite loops
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/refresh') || url.includes('/auth/register');
    
    // If 401, not already retrying, and not an auth endpoint, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshResponse = await authService.refresh();
        
        if (refreshResponse.success && refreshResponse.data) {
          // Update stored user
          authService.setCurrentUser(refreshResponse.data.user);
          
          // Retry the original request
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - clear state and redirect to login
        authService.clearCurrentUser();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // For auth endpoint errors or other errors, just reject
    return Promise.reject(error);
  }
);

// API Response types
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
