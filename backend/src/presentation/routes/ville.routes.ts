/**
 * Ville Routes
 * ===========================================
 * Presentation Layer - Routes
 * Endpoints: /api/v1/villes/*
 * Uses constants from tables.ts for table and column names
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../infrastructure/database/prisma.service.js';
import { COLUMNS } from '../../shared/constants/tables.js';
import { authenticate } from '../middleware/authenticate.middleware.js';
import { cacheService } from '../../shared/services/cache.service.js';

const VILLE_CACHE_KEY = 'villes:';
const VILLE_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export const villeRoutes = async (app: FastifyInstance): Promise<void> => {

  // GET /api/v1/villes
  app.get('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const cacheKey = `${VILLE_CACHE_KEY}all`;
    const cached = cacheService.get(cacheKey);
    if (cached) return reply.send({ success: true, data: cached });

    const villes = await prisma.villes.findMany({
      include: { zones_livraison: true }
    });

    cacheService.set(cacheKey, villes, VILLE_CACHE_TTL);
    return reply.send({ success: true, data: villes });
  });

  // GET /api/v1/villes/:codeVille
  app.get('/:codeVille', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeVille } = request.params as { codeVille: string };
    const cacheKey = `${VILLE_CACHE_KEY}${codeVille}`;
    const cached = cacheService.get(cacheKey);
    if (cached) return reply.send({ success: true, data: cached });

    const ville = await prisma.villes.findUnique({
      where: { [COLUMNS.CODE_VILLE]: codeVille },
      include: { zones_livraison: true }
    });
    if (!ville) return reply.status(404).send({ success: false, message: 'Not found' });

    cacheService.set(cacheKey, ville, VILLE_CACHE_TTL);
    return reply.send({ success: true, data: ville });
  });

  // POST /api/v1/villes
  app.post('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const data = request.body as Record<string, unknown>;
    const count = await prisma.villes.count();
    const codeVille = `VILLE_${(count + 1).toString().padStart(4, '0')}`;
    const ville = await prisma.villes.create({
      data: { ...data, [COLUMNS.CODE_VILLE]: codeVille } as never
    });
    cacheService.delByPrefix(VILLE_CACHE_KEY);
    return reply.status(201).send({ success: true, data: ville });
  });

  // PUT /api/v1/villes/:codeVille
  app.put('/:codeVille', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeVille } = request.params as { codeVille: string };
    const data = request.body as Record<string, unknown>;
    const ville = await prisma.villes.update({
      where: { [COLUMNS.CODE_VILLE]: codeVille },
      data: data as never
    });
    cacheService.delByPrefix(VILLE_CACHE_KEY);
    return reply.send({ success: true, data: ville });
  });

  // DELETE /api/v1/villes/:codeVille
  app.delete('/:codeVille', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeVille } = request.params as { codeVille: string };
    await prisma.villes.delete({ where: { [COLUMNS.VILLE_CODE]: codeVille } });
    cacheService.delByPrefix(VILLE_CACHE_KEY);
    return reply.send({ success: true, message: 'Deleted' });
  });
};
