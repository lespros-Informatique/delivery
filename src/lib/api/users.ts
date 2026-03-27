/**
 * Users API Service
 * ==========================================
 * User management endpoints
 */

import { apiClient, ApiResponse } from './client';
import { mapApiResponse } from './mapper';

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
  motDePasse?: string;
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
}

export const usersService = {
  /**
   * Get all users with pagination
   */
  async getAll(params?: PaginationParams): Promise<ApiResponse<User[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.search) queryParams.set('search', params.search);

    const response = await apiClient.get<ApiResponse<User[]>>(`/users?${queryParams}`);

    return {
      ...response.data,
      data: mapApiResponse(response.data.data) as unknown as User[]
    };
  },

  /**
   * Get user by code
   */
  async getByCode(code: string): Promise<ApiResponse<User>> {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${code}`);
    return {
      ...response.data,
      data: mapApiResponse(response.data.data) as unknown as User
    };
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
};

export default usersService;
