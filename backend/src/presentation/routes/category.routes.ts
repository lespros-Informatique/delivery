/**
 * Category Routes
 * ===========================================
 * Presentation Layer - Routes
 * Endpoints: /api/v1/categories/*
 * Uses constants from tables.ts for table and column names
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../infrastructure/database/prisma.service.js';
import { TABLES, COLUMNS } from '../../shared/constants/tables.js';
import { authenticate } from '../middleware/authenticate.middleware.js';

export const categoryRoutes = async (app: FastifyInstance): Promise<void> => {
  
  // GET /api/v1/categories
  app.get('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const categories = await prisma.categories.findMany({ include: { restaurants: true } });
    return reply.send({ success: true, data: categories });
  });

  // GET /api/v1/categories/:codeCategorie
  app.get('/:codeCategorie', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeCategorie } = request.params as { codeCategorie: string };
    const category = await prisma.categories.findUnique({ 
      where: { [COLUMNS.CODE_CATEGORIE]: codeCategorie }, 
      include: { produits: true } 
    });
    if (!category) return reply.status(404).send({ success: false, message: 'Not found' });
    return reply.send({ success: true, data: category });
  });

  // POST /api/v1/categories
  app.post('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const data = request.body as Record<string, unknown>;
    const count = await prisma.categories.count();
    const codeCategorie = `CAT_${(count + 1).toString().padStart(4, '0')}`;
    const category = await prisma.categories.create({ 
      data: { ...data, [COLUMNS.CODE_CATEGORIE]: codeCategorie } as never 
    });
    return reply.status(201).send({ success: true, data: category });
  });

  // PUT /api/v1/categories/:codeCategorie
  app.put('/:codeCategorie', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeCategorie } = request.params as { codeCategorie: string };
    const data = request.body as Record<string, unknown>;
    const category = await prisma.categories.update({ 
      where: { [COLUMNS.CODE_CATEGORIE]: codeCategorie }, 
      data: data as never 
    });
    return reply.send({ success: true, data: category });
  });

  // DELETE /api/v1/categories/:codeCategorie
  app.delete('/:codeCategorie', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeCategorie } = request.params as { codeCategorie: string };
    await prisma.categories.delete({ where: { [COLUMNS.CODE_CATEGORIE]: codeCategorie } });
    return reply.send({ success: true, message: 'Deleted' });
  });
};
