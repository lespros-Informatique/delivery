/**
 * Client Routes
 * ===========================================
 * Presentation Layer - Routes
 * Endpoints: /api/v1/clients/*
 * Uses constants from tables.ts for table and column names
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../infrastructure/database/prisma.service.js';
import { TABLES, COLUMNS } from '../../shared/constants/tables.js';
import { authenticate } from '../middleware/authenticate.middleware.js';

export const clientRoutes = async (app: FastifyInstance): Promise<void> => {
  
  // GET /api/v1/clients
  app.get('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    // Parse query params safely
    const query = request.query as Record<string, string>;
    const page = parseInt(query?.page || '1', 10);
    const limit = parseInt(query?.limit || '10', 10);
    const search = query?.search || '';

    // Build where clause
    const whereCondition = search
      ? {
          OR: [
            { [COLUMNS.NOM_CLIENT]: { contains: search } },
            { [COLUMNS.EMAIL_CLIENT]: { contains: search } },
            { [COLUMNS.TELEPHONE_CLIENT]: { contains: search } },
          ],
        }
      : undefined;

    // Get total count
    const total = await prisma.clients.count({ where: whereCondition });

    // Get paginated clients
    const clients = await prisma.clients.findMany({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
      include: { restaurants: true },
      orderBy: { [COLUMNS.CREATED_AT_CLIENT]: 'desc' },
    });

    return reply.send({ 
      success: true, 
      data: { 
        clients, 
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } 
      } 
    });
  });

  // GET /api/v1/clients/:codeClient
  app.get('/:codeClient', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeClient } = request.params as { codeClient: string };
    const client = await prisma.clients.findUnique({ 
      where: { [COLUMNS.CODE_CLIENT]: codeClient }, 
      include: { commandes: true } 
    });
    if (!client) return reply.status(404).send({ success: false, message: 'Not found' });
    return reply.send({ success: true, data: client });
  });

  // POST /api/v1/clients
  app.post('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const data = request.body as Record<string, unknown>;
    const count = await prisma.clients.count();
    const codeClient = `CLI_${(count + 1).toString().padStart(4, '0')}`;
    const client = await prisma.clients.create({ 
      data: { ...data, [COLUMNS.CODE_CLIENT]: codeClient } as never 
    });
    return reply.status(201).send({ success: true, data: client });
  });

  // PUT /api/v1/clients/:codeClient
  app.put('/:codeClient', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeClient } = request.params as { codeClient: string };
    const data = request.body as Record<string, unknown>;
    const client = await prisma.clients.update({ 
      where: { [COLUMNS.CODE_CLIENT]: codeClient }, 
      data: data as never 
    });
    return reply.send({ success: true, data: client });
  });

  // DELETE /api/v1/clients/:codeClient
  app.delete('/:codeClient', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeClient } = request.params as { codeClient: string };
    await prisma.clients.delete({ where: { [COLUMNS.CODE_CLIENT]: codeClient } });
    return reply.send({ success: true, message: 'Deleted' });
  });
};
