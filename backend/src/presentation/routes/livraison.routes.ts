/**
 * Livraison Routes
 * ===========================================
 * Presentation Layer - Routes
 * Endpoints: /api/v1/livraisons/*
 * Uses constants from tables.ts for table and column names
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../infrastructure/database/prisma.service.js';
import { TABLES, COLUMNS, STATUT_LIVRAISON } from '../../shared/constants/tables.js';
import { authenticate } from '../middleware/authenticate.middleware.js';

export const livraisonRoutes = async (app: FastifyInstance): Promise<void> => {
  
  // GET /api/v1/livraisons
  app.get('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const livraisons = await prisma.livraisons.findMany({ 
      include: { commandes: true, livreurs: true } 
    });
    return reply.send({ success: true, data: livraisons });
  });

  // GET /api/v1/livraisons/:codeLivraison
  app.get('/:codeLivraison', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeLivraison } = request.params as { codeLivraison: string };
    const livraison = await prisma.livraisons.findUnique({ 
      where: { [COLUMNS.CODE]: codeLivraison }, 
      include: { commandes: true, livreurs: true, livraison_positions: true } 
    });
    if (!livraison) return reply.status(404).send({ success: false, message: 'Not found' });
    return reply.send({ success: true, data: livraison });
  });

  // POST /api/v1/livraisons
  app.post('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const data = request.body as Record<string, unknown>;
    const count = await prisma.livraisons.count();
    const codeLivraison = `LIVR_${(count + 1).toString().padStart(4, '0')}`;
    const livraison = await prisma.livraisons.create({ 
      data: { 
        ...data, 
        [COLUMNS.CODE]: codeLivraison,
        [COLUMNS.STATUT_LIVRAISON]: STATUT_LIVRAISON.EN_ATTENTE
      } as never 
    });
    return reply.status(201).send({ success: true, data: livraison });
  });

  // PUT /api/v1/livraisons/:codeLivraison
  app.put('/:codeLivraison', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeLivraison } = request.params as { codeLivraison: string };
    const data = request.body as Record<string, unknown>;
    const livraison = await prisma.livraisons.update({ 
      where: { [COLUMNS.CODE]: codeLivraison }, 
      data: data as never 
    });
    return reply.send({ success: true, data: livraison });
  });

  // DELETE /api/v1/livraisons/:codeLivraison
  app.delete('/:codeLivraison', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeLivraison } = request.params as { codeLivraison: string };
    await prisma.livraisons.delete({ where: { [COLUMNS.CODE]: codeLivraison } });
    return reply.send({ success: true, message: 'Deleted' });
  });
};
