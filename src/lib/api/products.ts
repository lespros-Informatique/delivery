/**
 * Products API Service
 * ==========================================
 * Product management endpoints
 */

import { apiClient, ApiResponse } from './client';
import { PaginationParams } from './clients';
import { mapApiResponse } from './mapper';

export interface Product {
    id: number;
    codeProduit: string;
    libelleProduit: string;
    prixProduit: number;
    descriptionProduit?: string;
    imageProduit?: string;
    disponibleProduit: boolean;
    idCategorie: number;
    idRestaurant: number;
    categories?: {
        libelleCategorie: string;
    };
    restaurants?: {
        nomRestaurant: string;
    };
    createdAt: string;
    updatedAt: string;
}

export const productsService = {
    /**
     * Get all products
     */
    async getAll(params?: PaginationParams): Promise<ApiResponse<Product[]>> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.limit) queryParams.set('limit', params.limit.toString());
        if (params?.search) queryParams.set('search', params.search);

        const response = await apiClient.get<ApiResponse<Product[]>>(`/products?${queryParams}`);
        return {
            ...response.data,
            data: mapApiResponse(response.data.data) as Product[]
        };
    },

    /**
     * Get product by code
     */
    async getByCode(code: string): Promise<ApiResponse<Product>> {
        const response = await apiClient.get<ApiResponse<Product>>(`/products/${code}`);
        return {
            ...response.data,
            data: mapApiResponse(response.data.data) as Product
        };
    },

    /**
     * Create product
     */
    async create(data: any): Promise<ApiResponse<Product>> {
        const response = await apiClient.post<ApiResponse<Product>>('/products', data);
        return response.data;
    },

    /**
     * Update product
     */
    async update(code: string, data: any): Promise<ApiResponse<Product>> {
        const response = await apiClient.put<ApiResponse<Product>>(`/products/${code}`, data);
        return response.data;
    },

    /**
     * Delete product
     */
    async delete(code: string): Promise<ApiResponse<void>> {
        const response = await apiClient.delete<ApiResponse<void>>(`/products/${code}`);
        return response.data;
    },
};

export default productsService;
