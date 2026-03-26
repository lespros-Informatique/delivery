/**
 * Authentication Middleware
 * ===========================================
 * Centralized authentication middleware for all routes
 * Uses constants from tables.ts for consistency
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { TABLES } from '../../shared/constants/tables.js';

/**
 * JWT Payload interface
 */
export interface JwtPayload {
  id: number;
  codeUser: string;
  email: string;
  roles: string[];
  type: string;
}

/**
 * Extract access token from cookie or Authorization header
 */
function extractToken(request: FastifyRequest): string | null {
  // First try to get from cookie
  const cookieToken = request.headers.cookie?.match(/access_token=([^;]+)/)?.[1];
  if (cookieToken) {
    return cookieToken;
  }

  // Then try Authorization header
  const authHeader = request.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

/**
 * Set Authorization header with token for Fastify JWT verification
 */
function setAuthHeader(request: FastifyRequest, token: string): void {
  request.headers.authorization = `Bearer ${token}`;
}

/**
 * Authentication middleware factory
 * Use this in routes that need authentication
 * 
 * @example
 * ```typescript
 * export const userRoutes = async (app: FastifyInstance): Promise<void> => {
 *   app.get('/', { preHandler: [authenticate] }, async (request, reply) => {
 *     // User is authenticated
 *   });
 * };
 * ```
 */
export const authenticate = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    const token = extractToken(request);
    
    if (!token) {
      return reply.status(401).send({
        success: false,
        message: 'Token d\'authentification manquant',
      });
    }

    // Set the token in the authorization header for JWT verification
    setAuthHeader(request, token);
    
    // Verify the token
    await request.jwtVerify<JwtPayload>();
    
  } catch (error) {
    return reply.status(401).send({
      success: false,
      message: 'Token invalide ou expiré',
    });
  }
};

/**
 * Optional authentication middleware
 * Doesn't fail if no token, but attaches user if valid token present
 */
export const optionalAuth = async (request: FastifyRequest): Promise<void> => {
  try {
    const token = extractToken(request);
    if (token) {
      setAuthHeader(request, token);
      await request.jwtVerify<JwtPayload>();
    }
  } catch {
    // Ignore errors for optional auth
    // User will simply not be attached
  }
};

/**
 * Check if user has specific role
 */
export const requireRole = (requiredRole: string) => {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = request.user as JwtPayload;
    
    if (!user || !user.roles || !user.roles.includes(requiredRole)) {
      return reply.status(403).send({
        success: false,
        message: 'Accès refusé - Rôle requis',
      });
    }
  };
};

/**
 * Check if user has specific permission
 * Note: This requires permissions to be included in the JWT payload
 */
export const requirePermission = (requiredPermission: string) => {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = request.user as JwtPayload & { permissions?: string[] };
    
    if (!user || !user.permissions || !user.permissions.includes(requiredPermission)) {
      return reply.status(403).send({
        success: false,
        message: 'Accès refusé - Permission requise',
      });
    }
  };
};

// Export table names for reference in routes
export { TABLES };