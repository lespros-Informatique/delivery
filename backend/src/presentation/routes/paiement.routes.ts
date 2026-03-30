/**
 * Paiement Routes
 * ===========================================
 * Presentation Layer - Routes
 * Endpoints: /api/v1/paiements/*
 * Uses constants from tables.ts for table and column names
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../infrastructure/database/prisma.service.js';
import { TABLES, COLUMNS, STATUT_PAIEMENT } from '../../shared/constants/tables.js';
import { authenticate } from '../middleware/authenticate.middleware.js';

export const paiementRoutes = async (app: FastifyInstance): Promise<void> => {
  
  // GET /api/v1/paiements
  app.get('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const paiements = await prisma.paiements.findMany({ 
      include: { commandes: true } 
    });
    return reply.send({ success: true, data: paiements });
  });

  // GET /api/v1/paiements/:codePaiement
  app.get('/:codePaiement', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codePaiement } = request.params as { codePaiement: string };
    const paiement = await prisma.paiements.findUnique({ 
      where: { [COLUMNS.CODE]: codePaiement }, 
      include: { commandes: true } 
    });
    if (!paiement) return reply.status(404).send({ success: false, message: 'Not found' });
    return reply.send({ success: true, data: paiement });
  });

  // POST /api/v1/paiements
  app.post('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const data = request.body as Record<string, unknown>;
    const count = await prisma.paiements.count();
    const codePaiement = `PAIE_${(count + 1).toString().padStart(4, '0')}`;
    const paiement = await prisma.paiements.create({ 
      data: { 
        ...data, 
        [COLUMNS.CODE]: codePaiement,
        [COLUMNS.STATUT_PAIEMENT]: STATUT_PAIEMENT.EN_ATTENTE
      } as never 
    });
    return reply.status(201).send({ success: true, data: paiement });
  });

  // PUT /api/v1/paiements/:codePaiement
  app.put('/:codePaiement', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codePaiement } = request.params as { codePaiement: string };
    const data = request.body as Record<string, unknown>;
    const paiement = await prisma.paiements.update({ 
      where: { [COLUMNS.CODE]: codePaiement }, 
      data: data as never 
    });
    return reply.send({ success: true, data: paiement });
  });

  // DELETE /api/v1/paiements/:codePaiement
  app.delete('/:codePaiement', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codePaiement } = request.params as { codePaiement: string };
    await prisma.paiements.delete({ where: { [COLUMNS.CODE]: codePaiement } });
    return reply.send({ success: true, message: 'Deleted' });
  });
};
