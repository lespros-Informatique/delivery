/**
 * Users API Service
 * ==========================================
 * User management endpoints
 */

import { apiClient, ApiResponse } from './client';

export interface User {
  id: number;
  codeUser: string;
  email: string;
  nomUser: string;
  telephoneUser?: string;
  roles: string[];
  active: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  nomUser: string;
  telephoneUser?: string;
  roles?: string[];
}

export interface UpdateUserRequest {
  email?: string;
  nomUser?: string;
  telephoneUser?: string;
  roles?: string[];
  active?: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const usersService = {
  /**
   * Get all users with pagination
   */
  async getAll(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<User>>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.search) queryParams.set('search', params.search);
    if (params?.role) queryParams.set('role', params.role);

    const response = await apiClient.get<ApiResponse<PaginatedResponse<User>>>(`/users?${queryParams}`);
    return response.data;
  },

  /**
   * Get user by ID
   */
  async getById(id: number): Promise<ApiResponse<User>> {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  /**
   * Get user by code
   */
  async getByCode(code: string): Promise<ApiResponse<User>> {
    const response = await apiClient.get<ApiResponse<User>>(`/users/code/${code}`);
    return response.data;
  },

  /**
   * Create new user
   */
  async create(data: CreateUserRequest): Promise<ApiResponse<User>> {
    const response = await apiClient.post<ApiResponse<User>>('/users', data);
    return response.data;
  },

  /**
   * Update user
   */
  async update(id: number, data: UpdateUserRequest): Promise<ApiResponse<User>> {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Delete user
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/users/${id}`);
    return response.data;
  },

  /**
   * Toggle user active status
   */
  async toggleActive(id: number): Promise<ApiResponse<User>> {
    const response = await apiClient.patch<ApiResponse<User>>(`/users/${id}/toggle-active`);
    return response.data;
  },
};

export default usersService;
