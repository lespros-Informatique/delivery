/**
 * API Services Index
 * ==========================================
 * Export all API services for easy importing
 */

// Client
export { default as authService, type AuthUser, type AuthResponse, type LoginRequest, type RegisterRequest } from './auth';
export { default as usersService, type User, type CreateUserRequest, type UpdateUserRequest, type PaginationParams } from './users';
export { default as clientsService, type Client, type CreateClientRequest, type UpdateClientRequest } from './clients';
export { default as livreursService, type Livreur, type CreateLivreurRequest, type UpdateLivreurRequest } from './livreurs';
export { default as restaurantsService, type Restaurant, type CreateRestaurantRequest, type UpdateRestaurantRequest } from './restaurants';

// Re-export API client utilities
export { apiClient } from './client';
export type { ApiResponse, ApiError } from './client';