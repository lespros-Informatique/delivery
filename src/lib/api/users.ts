/**
 * Users API Service
 * ==========================================
 * User management endpoints
 */

import { apiClient, ApiResponse } from './client';
import axios from 'axios';
import { mapArrayToCamelCase } from './mapper';

export interface User {
  idUser: number;
  codeUser: string;
  emailUser: string;
  nomUser: string;
  telephoneUser?: string;
  etatUsers: boolean;
  createdAtUser: string;
  updatedAtUser?: string;
}

export interface CreateUserRequest {
  emailUser: string;
  nomUser: string;
  telephoneUser?: string;
  motDePasse: string;
}

export interface UpdateUserRequest {
  nomUser?: string;
  telephoneUser?: string;
  etatUsers?: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
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

    const response = await apiClient.get<ApiResponse<{ users: User[], pagination: PaginationMeta }>>(`/users?${queryParams}`);
    
    // Map users from snake_case to camelCase using the mapper
    const users = mapArrayToCamelCase(response.data.data?.users as unknown as Record<string, unknown>[] || []) as unknown as User[];
    
    return {
      success: response.data.success,
      data: {
        data: users,
        total: response.data.data?.pagination?.total || 0,
        page: response.data.data?.pagination?.page || 1,
        limit: response.data.data?.pagination?.limit || 10,
        totalPages: response.data.data?.pagination?.totalPages || 0,
      },
      message: response.data.message
    };
  },

  /**
   * Get user by code
   */
  async getByCode(code: string): Promise<ApiResponse<User>> {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${code}`);
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
  async update(codeUser: string, data: UpdateUserRequest): Promise<ApiResponse<User>> {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${codeUser}`, data);
    return response.data;
  },

  /**
   * Delete user
   */
  async delete(codeUser: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/users/${codeUser}`);
    return response.data;
  },

  /**
   * Toggle user active status
   */
  async toggleActive(codeUser: string): Promise<ApiResponse<User>> {
    const response = await apiClient.patch<ApiResponse<User>>(`/users/${codeUser}/toggle-active`);
    return response.data;
  },
};

export default usersService;
