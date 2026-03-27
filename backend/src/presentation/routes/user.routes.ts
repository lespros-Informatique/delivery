/**
 * User Routes
 * ===========================================
 * Presentation Layer - Routes
 * Endpoints: /api/v1/users/*
 * Uses constants from tables.ts for table and column names
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { prisma } from '../../infrastructure/database/prisma.service.js';
import { COLUMNS, ETAT_DEFAUT } from '../../shared/constants/tables.js';
import { authenticate } from '../middleware/authenticate.middleware.js';

// Validation schemas
const createUserSchema = z.object({
  emailUser: z.string().email(),
  nomUser: z.string().min(1),
  telephoneUser: z.string().optional().nullable(),
  motDePasse: z.string().min(6).optional(),
  etatUsers: z.boolean().optional(),
});

const updateUserSchema = z.object({
  nomUser: z.string().min(1).optional(),
  telephoneUser: z.string().optional().nullable(),
  etatUsers: z.boolean().optional(),
});

interface GetUsersQuery {
  page?: string;
  limit?: string;
  search?: string;
}

/**
 * Register routes
 */
export const userRoutes = async (app: FastifyInstance): Promise<void> => {
  // GET /api/v1/users
  app.get<{ Querystring: GetUsersQuery }>(
    '/',
    { preHandler: [authenticate] },
    async (request, reply) => {
      const page = parseInt(request.query.page || '1', 10);
      const limit = parseInt(request.query.limit || '10', 10);
      const search = request.query.search || '';

      // Build where clause only if there's a search term
      const searchCondition = search
        ? {
          OR: [
            { [COLUMNS.NOM_USER]: { contains: search } },
            { [COLUMNS.EMAIL_USER]: { contains: search } },
          ],
        }
        : undefined;

      // Get total count using Prisma count
      const total = await prisma.users.count({
        where: searchCondition,
      });

      // Get paginated users with select for efficiency
      const users = await prisma.users.findMany({
        where: searchCondition,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [COLUMNS.CREATED_AT_USER]: 'desc' },
        select: {
          id_user: true,
          code_user: true,
          nom_user: true,
          email_user: true,
          telephone_user: true,
          etat_users: true,
          created_at_user: true,
        },
      });

      return reply.send({
        success: true,
        data: users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    }
  );

  // GET /api/v1/users/:codeUser
  app.get<{ Params: { codeUser: string } }>(
    '/:codeUser',
    { preHandler: [authenticate] },
    async (request, reply) => {
      const { codeUser } = request.params;

      // Get user by code
      const user = await prisma.users.findUnique({
        where: { [COLUMNS.CODE_USER]: codeUser },
        include: {
          user_roles: {
            include: { roles: true },
          },
        },
      });

      if (!user) {
        return reply.status(404).send({
          success: false,
          message: 'User not found',
        });
      }

      return reply.send({
        success: true,
        data: user,
      });
    }
  );

  // POST /api/v1/users
  app.post(
    '/',
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        app.log.info({ body: request.body }, 'Creating user - Request body');
        const body = createUserSchema.parse(request.body);

        // Check if email exists
        const existing = await prisma.users.findUnique({
          where: { [COLUMNS.EMAIL_USER]: body.emailUser },
        });

        if (existing) {
          return reply.status(400).send({
            success: false,
            message: 'Email déjà utilisé',
          });
        }

        // Generate code using constant prefix
        const count = await prisma.users.count();
        const codeUser = `USER_${(count + 1).toString().padStart(4, '0')}`;

        // Password generation if not provided
        const passwordToHash = body.motDePasse || 'Woli@2024';
        const hashedPassword = await bcrypt.hash(passwordToHash, 12);

        const user = await prisma.users.create({
          data: {
            [COLUMNS.CODE_USER]: codeUser,
            [COLUMNS.EMAIL_USER]: body.emailUser,
            [COLUMNS.NOM_USER]: body.nomUser,
            [COLUMNS.TELEPHONE_USER]: body.telephoneUser || null,
            [COLUMNS.MOT_DE_PASSE]: hashedPassword,
            [COLUMNS.ETAT_USERS]: ETAT_DEFAUT.ACTIF,
          },
        });

        return reply.status(201).send({
          success: true,
          data: {
            idUser: user.id_user,
            codeUser: user.code_user,
            emailUser: user.email_user,
            nomUser: user.nom_user,
            passwordGenerated: !body.motDePasse ? 'Woli@2024' : undefined
          },
        });
      } catch (error: unknown) {
        app.log.error(error, 'Error creating user');
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            success: false,
            message: 'Validation failed',
            errors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
          });
        }
        return reply.status(500).send({
          success: false,
          message: error instanceof Error ? error.message : 'Erreur serveur',
        });
      }
    }
  );

  // PUT /api/v1/users/:codeUser
  app.put<{ Params: { codeUser: string } }>(
    '/:codeUser',
    { preHandler: [authenticate] },
    async (request, reply) => {
      const { codeUser } = request.params;
      const data = updateUserSchema.parse(request.body);

      // Build update data using column constants
      const updateData: Record<string, unknown> = {};
      if (data.nomUser) updateData[COLUMNS.NOM_USER] = data.nomUser;
      if (data.telephoneUser !== undefined) updateData[COLUMNS.TELEPHONE_USER] = data.telephoneUser;
      if (data.etatUsers !== undefined) updateData[COLUMNS.ETAT_USERS] = data.etatUsers ? ETAT_DEFAUT.ACTIF : ETAT_DEFAUT.INACTIF;

      const user = await prisma.users.update({
        where: { [COLUMNS.CODE_USER]: codeUser },
        data: updateData,
      });

      return reply.send({
        success: true,
        data: user,
      });
    }
  );

  // DELETE /api/v1/users/:codeUser
  app.delete<{ Params: { codeUser: string } }>(
    '/:codeUser',
    { preHandler: [authenticate] },
    async (request, reply) => {
      const { codeUser } = request.params;

      await prisma.users.delete({
        where: { [COLUMNS.CODE_USER]: codeUser },
      });

      return reply.send({
        success: true,
        message: 'User deleted',
      });
    }
  );
};
