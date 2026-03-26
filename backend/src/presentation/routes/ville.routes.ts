/**
 * Ville Routes
 * ===========================================
 * Presentation Layer - Routes
 * Endpoints: /api/v1/villes/*
 * Uses constants from tables.ts for table and column names
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../infrastructure/database/prisma.service.js';
import { TABLES, COLUMNS } from '../../shared/constants/tables.js';
import { authenticate } from '../middleware/authenticate.middleware.js';

export const villeRoutes = async (app: FastifyInstance): Promise<void> => {
  
  // GET /api/v1/villes
  app.get('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const villes = await prisma.villes.findMany({ 
      include: { zones_livraison: true } 
    });
    return reply.send({ success: true, data: villes });
  });

  // GET /api/v1/villes/:codeVille
  app.get('/:codeVille', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeVille } = request.params as { codeVille: string };
    const ville = await prisma.villes.findUnique({ 
      where: { [COLUMNS.CODE]: codeVille }, 
      include: { zones_livraison: true } 
    });
    if (!ville) return reply.status(404).send({ success: false, message: 'Not found' });
    return reply.send({ success: true, data: ville });
  });

  // POST /api/v1/villes
  app.post('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const data = request.body as Record<string, unknown>;
    const count = await prisma.villes.count();
    const codeVille = `VILLE_${(count + 1).toString().padStart(4, '0')}`;
    const ville = await prisma.villes.create({ 
      data: { ...data, [COLUMNS.CODE]: codeVille } as never 
    });
    return reply.status(201).send({ success: true, data: ville });
  });

  // PUT /api/v1/villes/:codeVille
  app.put('/:codeVille', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeVille } = request.params as { codeVille: string };
    const data = request.body as Record<string, unknown>;
    const ville = await prisma.villes.update({ 
      where: { [COLUMNS.CODE]: codeVille }, 
      data: data as never 
    });
    return reply.send({ success: true, data: ville });
  });

  // DELETE /api/v1/villes/:codeVille
  app.delete('/:codeVille', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeVille } = request.params as { codeVille: string };
    await prisma.villes.delete({ where: { [COLUMNS.CODE]: codeVille } });
    return reply.send({ success: true, message: 'Deleted' });
  });
};
