/**
 * Auth API Service
 * ==========================================
 * Authentication endpoints
 *
 * Security: Uses HTTP-only cookies for token storage (set by server).
 * The localStorage is used ONLY for display state (user info for UI).
 * Tokens NEVER touch localStorage — all auth is done via cookies.
 */

import { apiClient, ApiResponse } from './client';

// ─── Request / Response Types ───────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nomUser: string;
  telephoneUser?: string;
}

export interface AuthUser {
  id: number;
  codeUser: string;
  email: string;
  nomUser: string;
  telephoneUser?: string;
  roles: string[];
  permissions: string[];
}

export interface AuthResponse {
  user: AuthUser;
  // token field intentionally omitted — cookies are the single source of truth
}

// ─── Storage Keys (UI state only – never stores tokens) ─────────────────────

const USER_STORAGE_KEY = 'woli_user';

// ─── Auth Service ────────────────────────────────────────────────────────────

export const authService = {
  /**
   * Register a new user.
   * Tokens are set automatically via HTTP-only cookies by the server.
   */
  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data;
  },

  /**
   * Login user.
   * Tokens are set automatically via HTTP-only cookies by the server.
   */
  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data;
  },

  /**
   * Refresh access token using the refresh token cookie.
   * The server replaces both cookies transparently.
   */
  async refresh(): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh', {});
    return response.data;
  },

  /**
   * Logout user — server clears both cookies.
   */
  async logout(): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>('/auth/logout', {});
    return response.data;
  },

  /**
   * Get authenticated user data from the server (verifies cookie).
   */
  async me(): Promise<ApiResponse<AuthUser>> {
    const response = await apiClient.get<ApiResponse<AuthUser>>('/auth/me');
    return response.data;
  },

  // ─── UI State Helpers (display only – NOT used for auth decisions) ─────────

  /**
   * Returns true if a user object is stored in localStorage.
   * This is a UI-only hint — actual auth is verified server-side via cookies.
   */
  isAuthenticated(): boolean {
    return localStorage.getItem(USER_STORAGE_KEY) !== null;
  },

  /**
   * Get stored user data (for display purposes only).
   * Do NOT use for auth checks — rely on server responses or `me()`.
   */
  getCurrentUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },

  /**
   * Persist user data for UI display after a successful login/refresh.
   * Does NOT store tokens.
   */
  setCurrentUser(user: AuthUser): void {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  },

  /**
   * Remove stored user data (called on logout).
   */
  clearCurrentUser(): void {
    localStorage.removeItem(USER_STORAGE_KEY);
  },
};

export default authService;
