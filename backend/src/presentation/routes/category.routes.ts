/**
 * Category Routes
 * ===========================================
 * Presentation Layer - Routes
 * Endpoints: /api/v1/categories/*
 * Uses constants from tables.ts for table and column names
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../infrastructure/database/prisma.service.js';
import { COLUMNS } from '../../shared/constants/tables.js';
import { authenticate } from '../middleware/authenticate.middleware.js';
import { cacheService } from '../../shared/services/cache.service.js';

const CAT_CACHE_KEY = 'categories:';
const CAT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const categoryRoutes = async (app: FastifyInstance): Promise<void> => {

  // GET /api/v1/categories
  app.get('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const cacheKey = `${CAT_CACHE_KEY}all`;
    const cached = cacheService.get(cacheKey);
    if (cached) return reply.send({ success: true, data: cached });

    const categories = await prisma.categories.findMany({ include: { restaurants: true } });

    cacheService.set(cacheKey, categories, CAT_CACHE_TTL);
    return reply.send({ success: true, data: categories });
  });

  // GET /api/v1/categories/:codeCategorie
  app.get('/:codeCategorie', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeCategorie } = request.params as { codeCategorie: string };
    const cacheKey = `${CAT_CACHE_KEY}${codeCategorie}`;
    const cached = cacheService.get(cacheKey);
    if (cached) return reply.send({ success: true, data: cached });

    const category = await prisma.categories.findUnique({
      where: { [COLUMNS.CODE_CATEGORIE]: codeCategorie },
      include: { produits: true }
    });
    if (!category) return reply.status(404).send({ success: false, message: 'Not found' });

    cacheService.set(cacheKey, category, CAT_CACHE_TTL);
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
    cacheService.delByPrefix(CAT_CACHE_KEY);
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
    cacheService.delByPrefix(CAT_CACHE_KEY);
    return reply.send({ success: true, data: category });
  });

  // DELETE /api/v1/categories/:codeCategorie
  app.delete('/:codeCategorie', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeCategorie } = request.params as { codeCategorie: string };
    await prisma.categories.delete({ where: { [COLUMNS.CODE_CATEGORIE]: codeCategorie } });
    cacheService.delByPrefix(CAT_CACHE_KEY);
    return reply.send({ success: true, message: 'Deleted' });
  });
};
