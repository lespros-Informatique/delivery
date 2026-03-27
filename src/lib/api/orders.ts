/**
 * Orders API Service
 * ==========================================
 * Order management endpoints
 */

import { apiClient, ApiResponse } from './client';
import { PaginationParams } from './clients';
import { mapApiResponse } from './mapper';

export interface Order {
    id: number;
    codeCommande: string;
    idRestaurant: number;
    idClient: number;
    statutCommande: string;
    totalCommande: number;
    dateCommande?: string;
    createdAt: string;
    updatedAt: string;
    restaurants?: {
        nomRestaurant: string;
    };
    clients?: {
        nomClient: string;
    };
}

export interface CreateOrderRequest {
    idRestaurant: number;
    idClient: number;
    totalCommande: number;
    statutCommande?: string;
    lignes?: Array<{
        idProduit: number;
        quantite: number;
        prixUnitaire: number;
    }>;
}

export const ordersService = {
    /**
     * Get all orders with pagination
     */
    async getAll(params?: PaginationParams): Promise<ApiResponse<Order[]>> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.limit) queryParams.set('limit', params.limit.toString());
        if (params?.search) queryParams.set('search', params.search);

        const response = await apiClient.get<ApiResponse<Order[]>>(`/commandes?${queryParams}`);
        return {
            ...response.data,
            data: mapApiResponse(response.data.data) as unknown as Order[]
        };
    },
    /**
     * Get order by code
     */
    async getByCode(code: string): Promise<ApiResponse<Order>> {
        const response = await apiClient.get<ApiResponse<Order>>(`/commandes/${code}`);
        return {
            ...response.data,
            data: mapApiResponse(response.data.data) as unknown as Order
        };
    },

    /**
     * Create new order
     */
    async create(data: CreateOrderRequest): Promise<ApiResponse<Order>> {
        const response = await apiClient.post<ApiResponse<Order>>('/commandes', data);
        return response.data;
    },

    /**
     * Update order status or data
     */
    async update(code: string, data: any): Promise<ApiResponse<Order>> {
        const response = await apiClient.put<ApiResponse<Order>>(`/commandes/${code}`, data);
        return response.data;
    },

    /**
     * Delete order
     */
    async delete(code: string): Promise<ApiResponse<void>> {
        const response = await apiClient.delete<ApiResponse<void>>(`/commandes/${code}`);
        return response.data;
    },
};

export default ordersService;
