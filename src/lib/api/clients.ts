/**
 * Clients API Service
 * ==========================================
 * Client management endpoints
 */

import { apiClient, ApiResponse } from './client';

export interface Client {
  id: number;
  codeClient: string;
  nomClient: string;
  emailClient?: string;
  telephoneClient: string;
  addressClient: string;
  latitude?: number;
  longitude?: number;
  active: boolean;
  Ville?: {
    id: number;
    nomVille: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientRequest {
  nomClient: string;
  emailClient?: string;
  telephoneClient: string;
  addressClient: string;
  latitude?: number;
  longitude?: number;
  idVille?: number;
}

export interface UpdateClientRequest {
  nomClient?: string;
  emailClient?: string;
  telephoneClient?: string;
  addressClient?: string;
  latitude?: number;
  longitude?: number;
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

export const clientsService = {
  /**
   * Get all clients with pagination
   */
  async getAll(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Client>>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.search) queryParams.set('search', params.search);
    if (params?.active !== undefined) queryParams.set('active', params.active.toString());
    if (params?.idVille) queryParams.set('idVille', params.idVille.toString());

    const response = await apiClient.get<ApiResponse<PaginatedResponse<Client>>>(`/clients?${queryParams}`);
    return response.data;
  },

  /**
   * Get client by code
   */
  async getByCode(code: string): Promise<ApiResponse<Client>> {
    const response = await apiClient.get<ApiResponse<Client>>(`/clients/${code}`);
    return response.data;
  },

  /**
   * Create new client
   */
  async create(data: CreateClientRequest): Promise<ApiResponse<Client>> {
    const response = await apiClient.post<ApiResponse<Client>>('/clients', data);
    return response.data;
  },

  /**
   * Update client
   */
  async update(codeClient: string, data: UpdateClientRequest): Promise<ApiResponse<Client>> {
    const response = await apiClient.put<ApiResponse<Client>>(`/clients/${codeClient}`, data);
    return response.data;
  },

  /**
   * Delete client
   */
  async delete(codeClient: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/clients/${codeClient}`);
    return response.data;
  },

  /**
   * Toggle client active status
   */
  async toggleActive(codeClient: string): Promise<ApiResponse<Client>> {
    const response = await apiClient.patch<ApiResponse<Client>>(`/clients/${codeClient}/toggle-active`);
    return response.data;
  },
};

export default clientsService;