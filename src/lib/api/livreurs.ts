/**
 * Livreurs API Service
 * ==========================================
 * Delivery personnel management endpoints
 */

import { apiClient, ApiResponse } from './client';

export interface Livreur {
  id: number;
  codeLivreur: string;
  nomLivreur: string;
  emailLivreur?: string;
  telephoneLivreur: string;
  addresseLivreur?: string;
  latitude?: number;
  longitude?: number;
  imageLivreur?: string;
  active: boolean;
  disponible: boolean;
  Ville?: {
    id: number;
    nomVille: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateLivreurRequest {
  nomLivreur: string;
  emailLivreur?: string;
  telephoneLivreur: string;
  addresseLivreur?: string;
  latitude?: number;
  longitude?: number;
  imageLivreur?: string;
  idVille?: number;
}

export interface UpdateLivreurRequest {
  nomLivreur?: string;
  emailLivreur?: string;
  telephoneLivreur?: string;
  addresseLivreur?: string;
  latitude?: number;
  longitude?: number;
  imageLivreur?: string;
  active?: boolean;
  disponible?: boolean;
  idVille?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean;
  disponible?: boolean;
  idVille?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const livreursService = {
  /**
   * Get all livreurs with pagination
   */
  async getAll(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Livreur>>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.search) queryParams.set('search', params.search);
    if (params?.active !== undefined) queryParams.set('active', params.active.toString());
    if (params?.disponible !== undefined) queryParams.set('disponible', params.disponible.toString());
    if (params?.idVille) queryParams.set('idVille', params.idVille.toString());

    const response = await apiClient.get<ApiResponse<PaginatedResponse<Livreur>>>(`/livreurs?${queryParams}`);
    return response.data;
  },

  /**
   * Get livreur by ID
   */
  async getById(id: number): Promise<ApiResponse<Livreur>> {
    const response = await apiClient.get<ApiResponse<Livreur>>(`/livreurs/${id}`);
    return response.data;
  },

  /**
   * Create new livreur
   */
  async create(data: CreateLivreurRequest): Promise<ApiResponse<Livreur>> {
    const response = await apiClient.post<ApiResponse<Livreur>>('/livreurs', data);
    return response.data;
  },

  /**
   * Update livreur
   */
  async update(id: number, data: UpdateLivreurRequest): Promise<ApiResponse<Livreur>> {
    const response = await apiClient.put<ApiResponse<Livreur>>(`/livreurs/${id}`, data);
    return response.data;
  },

  /**
   * Delete livreur
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/livreurs/${id}`);
    return response.data;
  },

  /**
   * Toggle livreur active status
   */
  async toggleActive(id: number): Promise<ApiResponse<Livreur>> {
    const response = await apiClient.patch<ApiResponse<Livreur>>(`/livreurs/${id}/toggle-active`);
    return response.data;
  },

  /**
   * Toggle livreur availability
   */
  async toggleDisponible(id: number): Promise<ApiResponse<Livreur>> {
    const response = await apiClient.patch<ApiResponse<Livreur>>(`/livreurs/${id}/toggle-disponible`);
    return response.data;
  },
};

export default livreursService;