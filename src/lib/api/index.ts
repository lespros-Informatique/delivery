/**
 * API Services Index
 * ==========================================
 * Export all API services for easy importing
 */

// Auth
export { default as authService, type AuthUser, type AuthResponse, type LoginRequest, type RegisterRequest } from './auth';

// Users
export { default as usersService, type User, type CreateUserRequest, type UpdateUserRequest, type PaginationParams } from './users';

// Clients
export { default as clientsService, type Client, type CreateClientRequest, type UpdateClientRequest } from './clients';

// Livreurs
export { default as livreursService, type Livreur, type CreateLivreurRequest, type UpdateLivreurRequest } from './livreurs';

// Restaurants
export { default as restaurantsService, type Restaurant, type CreateRestaurantRequest, type UpdateRestaurantRequest } from './restaurants';

// API Client
export { apiClient } from './client';
export type { ApiResponse, ApiError } from './client';

// Mapper utilities
export { mapToCamelCase, mapArrayToCamelCase, mapApiResponse, toSnakeCase, FIELD_MAPPING } from './mapper';