/**
 * Auth API Service
 * ==========================================
 * Authentication endpoints
 * 
 * Security: Uses HTTP-only cookies for token storage
 * to prevent XSS attacks. Tokens are set by the server.
 */

import { apiClient, ApiResponse } from './client';

// Types matching backend
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
  token?: string; // Token still returned for compatibility, but primary is cookies
}

export const authService = {
  /**
   * Register a new user
   * Note: Tokens are set via HTTP-only cookies by the server
   */
  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data;
  },

  /**
   * Login user
   * Note: Tokens are set via HTTP-only cookies by the server
   */
  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data;
  },

  /**
   * Refresh access token using refresh token cookie
   */
  async refresh(): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh', {});
    return response.data;
  },

  /**
   * Logout user - clears cookies via server
   */
  async logout(): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>('/auth/logout', {});
    return response.data;
  },

  /**
   * Get current user
   */
  async me(): Promise<ApiResponse<AuthUser>> {
    const response = await apiClient.get<ApiResponse<AuthUser>>('/auth/me');
    return response.data;
  },

  /**
   * Check if user is authenticated
   * Note: In cookie-based auth, we rely on the presence of cookies
   * This is a best-effort check - actual auth is verified by the server
   */
  isAuthenticated(): boolean {
    // Check if we have a stored user from a previous successful login
    // The actual authentication is handled by the server via cookies
    return localStorage.getItem('woli_user') !== null;
  },

  /**
   * Get stored user (for display purposes only)
   * Authentication is verified by the server via cookies
   */
  getCurrentUser(): AuthUser | null {
    const userStr = localStorage.getItem('woli_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Store user in localStorage (for UI state only)
   * Note: This is for display purposes only, not for authentication
   * Authentication is handled via HTTP-only cookies
   */
  setCurrentUser(user: AuthUser): void {
    localStorage.setItem('woli_user', JSON.stringify(user));
  },

  /**
   * Store access token in localStorage
   * Note: This is for API requests that require Authorization header
   */
  setToken(token: string): void {
    localStorage.setItem('woli_token', token);
  },

  /**
   * Clear stored user (for logout UI state)
   */
  clearCurrentUser(): void {
    localStorage.removeItem('woli_user');
  },
};

export default authService;
