/**
 * Auth Routes
 * ===========================================
 * Presentation Layer - Routes
 * Endpoints: /api/v1/auth/*
 * 
 * Security Features:
 * - Access token (15min) + Refresh token (7 days)
 * - Token refresh endpoint
 * - Secure logout
 * Uses constants from tables.ts for table and column names
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { prisma } from '../../infrastructure/database/prisma.service.js';
import { logger } from '../../shared/utils/logger.util.js';
import { TABLES, COLUMNS, ETAT_DEFAUT } from '../../shared/constants/tables.js';
import { authenticate } from '../middleware/authenticate.middleware.js';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  nomUser: z.string().min(1, 'Le nom est requis'),
  telephoneUser: z.string().optional(),
});

/**
 * Generate tokens with Fastify JWT
 */
function generateTokens(app: FastifyInstance, user: {
  id_user: number;
  code_user: string;
  email_user: string;
  nom_user: string;
}, roles: string[]) {
  // Access token (short-lived)
  const accessToken = app.jwt.sign({
    id: user.id_user,
    codeUser: user.code_user,
    email: user.email_user,
    roles,
    type: 'access',
  }, { expiresIn: ACCESS_TOKEN_EXPIRY });

  // Refresh token (long-lived)
  const refreshToken = app.jwt.sign({
    id: user.id_user,
    codeUser: user.code_user,
    type: 'refresh',
  }, { expiresIn: REFRESH_TOKEN_EXPIRY });

  return { accessToken, refreshToken };
}

/**
 * Set cookies with security options using raw headers
 */
function setAuthCookies(reply: FastifyReply, accessToken: string, refreshToken: string) {
  const cookieOptions = 'HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=';
  
  // Access token cookie (15 minutes)
  reply.header('Set-Cookie', `access_token=${accessToken}; ${cookieOptions}900`);
  
  // Refresh token cookie (7 days)
  reply.header('Set-Cookie', `refresh_token=${refreshToken}; ${cookieOptions}604800`);
}

/**
 * Clear auth cookies (logout)
 */
function clearAuthCookies(reply: FastifyReply) {
  reply.header('Set-Cookie', 'access_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0');
  reply.header('Set-Cookie', 'refresh_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0');
}

/**
 * Register routes
 */
export const authRoutes = async (app: FastifyInstance): Promise<void> => {

  // POST /api/v1/auth/register
  app.post(
    '/register',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const data = registerSchema.parse(request.body);

        // Check if user exists using Prisma
        const existingUser = await prisma.users.findUnique({
          where: { [COLUMNS.EMAIL_USER]: data.email },
        });

        if (existingUser) {
          return reply.status(400).send({
            success: false,
            message: 'Cet email est déjà enregistré',
          });
        }

        // Generate user code
        const userCount = await prisma.users.count();
        const codeUser = `USER_${(userCount + 1).toString().padStart(4, '0')}`;

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 12);

        // Create user
        const newUser = await prisma.users.create({
          data: {
            [COLUMNS.CODE_USER]: codeUser,
            [COLUMNS.EMAIL_USER]: data.email,
            [COLUMNS.NOM_USER]: data.nomUser,
            [COLUMNS.TELEPHONE_USER]: data.telephoneUser || null,
            [COLUMNS.MOT_DE_PASSE]: hashedPassword,
            [COLUMNS.ETAT_USERS]: ETAT_DEFAUT.ACTIF,
          },
        });

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(
          app,
          newUser,
          [] // No roles for new users
        );

        // Set cookies
        setAuthCookies(reply, accessToken, refreshToken);

        logger.info(`User registered: ${newUser.email_user}`);

        return reply.status(201).send({
          success: true,
          data: {
            user: {
              id: newUser.id_user,
              codeUser: newUser.code_user,
              email: newUser.email_user,
              nomUser: newUser.nom_user,
            },
            token: accessToken, // For backward compatibility
          },
        });
      } catch (error: any) {
        logger.error(`Registration error: ${error.message}`);
        return reply.status(400).send({
          success: false,
          message: error.message || "Erreur lors de l'inscription",
        });
      }
    }
  );

  // POST /api/v1/auth/login
  app.post(
    '/login',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const data = loginSchema.parse(request.body);

        // Find user using Prisma
        const user = await prisma.users.findUnique({
          where: { [COLUMNS.EMAIL_USER]: data.email },
        });

        if (!user) {
          return reply.status(401).send({
            success: false,
            message: 'Email ou mot de passe incorrect',
          });
        }

        // Verify password
        const validPassword = await bcrypt.compare(data.password, user.mot_de_passe);

        if (!validPassword) {
          return reply.status(401).send({
            success: false,
            message: 'Email ou mot de passe incorrect',
          });
        }

        // Check if user is active
        if (user.etat_users !== ETAT_DEFAUT.ACTIF) {
          return reply.status(403).send({
            success: false,
            message: 'Votre compte est désactivé',
          });
        }

        // Get roles from database
        const userRoles = await prisma.user_roles.findMany({
          where: {
            [COLUMNS.USER_CODE]: user.code_user,
            etat_user_role: ETAT_DEFAUT.ACTIF,
          },
          include: {
            roles: true,
          },
        });

        const roles = userRoles.map((ur: any) => ur.roles.code_role);

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(
          app,
          user,
          roles
        );

        // Set cookies
        setAuthCookies(reply, accessToken, refreshToken);

        logger.info(`User logged in: ${user.email_user}`);

        return reply.send({
          success: true,
          data: {
            user: {
              id: user.id_user,
              codeUser: user.code_user,
              email: user.email_user,
              nomUser: user.nom_user,
              roles,
            },
            token: accessToken, // For backward compatibility
          },
        });
      } catch (error: any) {
        logger.error(`Login error: ${error.message}`);
        return reply.status(401).send({
          success: false,
          message: 'Email ou mot de passe incorrect',
        });
      }
    }
  );

  // POST /api/v1/auth/refresh - Refresh access token
  app.post(
    '/refresh',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // Get refresh token from cookie
        const refreshToken = request.headers.cookie?.match(/refresh_token=([^;]+)/)?.[1];

        if (!refreshToken) {
          return reply.status(401).send({
            success: false,
            message: 'Refresh token manquant',
          });
        }

        // Verify refresh token
        const decoded = app.jwt.verify<{
          id: number;
          codeUser: string;
          type: string;
        }>(refreshToken);

        if (decoded.type !== 'refresh') {
          return reply.status(401).send({
            success: false,
            message: 'Token invalide',
          });
        }

        // Get user from database
        const user = await prisma.users.findUnique({
          where: { id_user: decoded.id },
        });

        if (!user || user.etat_users !== ETAT_DEFAUT.ACTIF) {
          return reply.status(401).send({
            success: false,
            message: 'Utilisateur non trouvé ou inactif',
          });
        }

        // Get roles
        const userRoles = await prisma.user_roles.findMany({
          where: {
            [COLUMNS.USER_CODE]: user.code_user,
            etat_user_role: ETAT_DEFAUT.ACTIF,
          },
          include: {
            roles: true,
          },
        });

        const roles = userRoles.map((ur: any) => ur.roles.code_role);

        // Generate new tokens
        const tokens = generateTokens(app, user, roles);

        // Set new cookies
        setAuthCookies(reply, tokens.accessToken, tokens.refreshToken);

        logger.info(`Token refreshed for user: ${user.email_user}`);

        return reply.send({
          success: true,
          data: {
            user: {
              id: user.id_user,
              codeUser: user.code_user,
              email: user.email_user,
              nomUser: user.nom_user,
              roles,
            },
            token: tokens.accessToken,
          },
        });
      } catch (error: any) {
        logger.error(`Token refresh error: ${error.message}`);
        return reply.status(401).send({
          success: false,
          message: 'Session expirée, veuillez vous reconnecter',
        });
      }
    }
  );

  // POST /api/v1/auth/logout
  app.post(
    '/logout',
    async (request: FastifyRequest, reply: FastifyReply) => {
      clearAuthCookies(reply);
      
      logger.info(`User logged out`);
      
      return reply.send({
        success: true,
        message: 'Déconnexion réussie',
      });
    }
  );

  // GET /api/v1/auth/me - Get current user
  app.get(
    '/me',
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = request.user as { id: number; codeUser: string };

        // Get user with roles and permissions
        const dbUser = await prisma.users.findUnique({
          where: { id_user: user.id },
        });

        if (!dbUser) {
          return reply.status(404).send({
            success: false,
            message: 'Utilisateur non trouvé',
          });
        }

        // Get roles
        const userRoles = await prisma.user_roles.findMany({
          where: {
            [COLUMNS.USER_CODE]: dbUser.code_user,
            etat_user_role: ETAT_DEFAUT.ACTIF,
          },
          include: {
            roles: true,
          },
        });

        const roles = userRoles.map((ur: any) => ur.roles.code_role);

        // Get permissions
        const roleCodes = userRoles.map((ur: any) => ur.role_code);
        const permissions = await prisma.role_permissions.findMany({
          where: {
            role_code: { in: roleCodes },
          },
          include: {
            permissions: true,
          },
        });

        const uniquePermissions = [...new Set(permissions.map((p: any) => p.permissions.code_permission))];

        return reply.send({
          success: true,
          data: {
            id: dbUser.id_user,
            codeUser: dbUser.code_user,
            email: dbUser.email_user,
            nomUser: dbUser.nom_user,
            telephoneUser: dbUser.telephone_user,
            roles,
            permissions: uniquePermissions,
          },
        });
      } catch (error: any) {
        logger.error(`Get current user error: ${error.message}`);
        return reply.status(401).send({
          success: false,
          message: 'Session expirée',
        });
      }
    }
  );
};
