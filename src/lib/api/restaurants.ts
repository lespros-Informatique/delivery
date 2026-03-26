/**
 * Restaurants API Service
 * ==========================================
 * Restaurant management endpoints
 */

import { apiClient, ApiResponse } from './client';

export interface Restaurant {
  id: number;
  codeRestaurant: string;
  nomRestaurant: string;
  descriptionRestaurant?: string;
  addressRestaurant: string;
  telephoneRestaurant?: string;
  emailRestaurant?: string;
  latitude?: number;
  longitude?: number;
  imageRestaurant?: string;
  active: boolean;
  noteRestaurant?: number;
  Ville?: {
    id: number;
    nomVille: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateRestaurantRequest {
  nomRestaurant: string;
  descriptionRestaurant?: string;
  addressRestaurant: string;
  telephoneRestaurant?: string;
  emailRestaurant?: string;
  latitude?: number;
  longitude?: number;
  imageRestaurant?: string;
  idVille?: number;
}

export interface UpdateRestaurantRequest {
  nomRestaurant?: string;
  descriptionRestaurant?: string;
  addressRestaurant?: string;
  telephoneRestaurant?: string;
  emailRestaurant?: string;
  latitude?: number;
  longitude?: number;
  imageRestaurant?: string;
  active?: boolean;
  idVille?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean;
  idVille?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const restaurantsService = {
  /**
   * Get all restaurants with pagination
   */
  async getAll(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Restaurant>>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.search) queryParams.set('search', params.search);
    if (params?.active !== undefined) queryParams.set('active', params.active.toString());
    if (params?.idVille) queryParams.set('idVille', params.idVille.toString());

    const response = await apiClient.get<ApiResponse<PaginatedResponse<Restaurant>>>(`/restaurants?${queryParams}`);
    return response.data;
  },

  /**
   * Get restaurant by code
   */
  async getByCode(code: string): Promise<ApiResponse<Restaurant>> {
    const response = await apiClient.get<ApiResponse<Restaurant>>(`/restaurants/${code}`);
    return response.data;
  },

  /**
   * Create new restaurant
   */
  async create(data: CreateRestaurantRequest): Promise<ApiResponse<Restaurant>> {
    const response = await apiClient.post<ApiResponse<Restaurant>>('/restaurants', data);
    return response.data;
  },

  /**
   * Update restaurant
   */
  async update(codeRestaurant: string, data: UpdateRestaurantRequest): Promise<ApiResponse<Restaurant>> {
    const response = await apiClient.put<ApiResponse<Restaurant>>(`/restaurants/${codeRestaurant}`, data);
    return response.data;
  },

  /**
   * Delete restaurant
   */
  async delete(codeRestaurant: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/restaurants/${codeRestaurant}`);
    return response.data;
  },

  /**
   * Toggle restaurant active status
   */
  async toggleActive(codeRestaurant: string): Promise<ApiResponse<Restaurant>> {
    const response = await apiClient.patch<ApiResponse<Restaurant>>(`/restaurants/${codeRestaurant}/toggle-active`);
    return response.data;
  },
};

export default restaurantsService;