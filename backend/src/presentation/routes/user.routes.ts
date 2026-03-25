/**
 * User Routes
 * ===========================================
 * Presentation Layer - Routes
 * Endpoints: /api/v1/users/*
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { prisma } from '../../infrastructure/database/prisma.service.js';

// Validation schemas
const createUserSchema = z.object({
  emailUser: z.string().email(),
  nomUser: z.string().min(1),
  telephoneUser: z.string().optional(),
  motDePasse: z.string().min(6),
});

const updateUserSchema = z.object({
  nomUser: z.string().min(1).optional(),
  telephoneUser: z.string().optional(),
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
  // Middleware to check auth
  const authenticate = async (request: FastifyRequest): Promise<void> => {
    try {
      await request.jwtVerify();
    } catch (err) {
      throw err;
    }
  };

  // GET /api/v1/users
  app.get(
    '/',
    { preHandler: [authenticate] },
    async (request: FastifyRequest<{ Querystring: GetUsersQuery }>, reply: FastifyReply) => {
      const page = parseInt(request.query.page || '1', 10);
      const limit = parseInt(request.query.limit || '10', 10);
      const search = request.query.search || '';

      // Build where clause only if there's a search term
      const searchCondition = search
        ? {
            OR: [
              { nomUser: { contains: search } },
              { emailUser: { contains: search } },
            ],
          }
        : undefined;

      // Get total count using findMany with _count
      const usersWithCount = await prisma.user.findMany({
        where: searchCondition,
        select: {
          idUser: true,
        },
        orderBy: { createdAtUser: 'desc' },
      });

      const users = await prisma.user.findMany({
        where: searchCondition,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAtUser: 'desc' },
        select: {
          idUser: true,
          codeUser: true,
          nomUser: true,
          emailUser: true,
          telephoneUser: true,
          etatUsers: true,
          createdAtUser: true,
        },
      });

      const total = usersWithCount.length;

      return reply.send({
        success: true,
        data: {
          users,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    }
  );

  // GET /api/v1/users/:codeUser
  app.get(
    '/:codeUser',
    { preHandler: [authenticate] },
    async (request: FastifyRequest<{ Params: { codeUser: string } }>, reply: FastifyReply) => {
      const { codeUser } = request.params;

      const user = await prisma.user.findUnique({
        where: { codeUser },
        include: {
          userRoles: {
            include: { role: true },
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
      const data = createUserSchema.parse(request.body);

      // Check if email exists
      const existing = await prisma.user.findUnique({
        where: { emailUser: data.emailUser },
      });

      if (existing) {
        return reply.status(400).send({
          success: false,
          message: 'Email already exists',
        });
      }

      // Generate code
      const count = await prisma.user.count();
      const codeUser = `USER_${(count + 1).toString().padStart(4, '0')}`;

      // Hash password
      const hashedPassword = await bcrypt.hash(data.motDePasse, 12);

      const user = await prisma.user.create({
        data: {
          codeUser,
          emailUser: data.emailUser,
          nomUser: data.nomUser,
          telephoneUser: data.telephoneUser || null,
          motDePasse: hashedPassword,
        },
      });

      return reply.status(201).send({
        success: true,
        data: {
          idUser: user.idUser,
          codeUser: user.codeUser,
          emailUser: user.emailUser,
          nomUser: user.nomUser,
        },
      });
    }
  );

  // PUT /api/v1/users/:codeUser
  app.put(
    '/:codeUser',
    { preHandler: [authenticate] },
    async (request: FastifyRequest<{ Params: { codeUser: string } }>, reply: FastifyReply) => {
      const { codeUser } = request.params;
      const data = updateUserSchema.parse(request.body);

      const user = await prisma.user.update({
        where: { codeUser },
        data,
      });

      return reply.send({
        success: true,
        data: user,
      });
    }
  );

  // DELETE /api/v1/users/:codeUser
  app.delete(
    '/:codeUser',
    { preHandler: [authenticate] },
    async (request: FastifyRequest<{ Params: { codeUser: string } }>, reply: FastifyReply) => {
      const { codeUser } = request.params;

      await prisma.user.delete({
        where: { codeUser },
      });

      return reply.send({
        success: true,
        message: 'User deleted',
      });
    }
  );
};
