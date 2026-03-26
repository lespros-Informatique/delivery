/**
 * Commande Routes
 * ===========================================
 * Presentation Layer - Routes
 * Endpoints: /api/v1/commandes/*
 * Uses constants from tables.ts for table and column names
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../infrastructure/database/prisma.service.js';
import { TABLES, COLUMNS, STATUT_COMMANDE } from '../../shared/constants/tables.js';
import { authenticate } from '../middleware/authenticate.middleware.js';

export const commandeRoutes = async (app: FastifyInstance): Promise<void> => {
  
  // GET /api/v1/commandes
  app.get('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const commandes = await prisma.commandes.findMany({ 
      include: { restaurants: true, clients: true } 
    });
    return reply.send({ success: true, data: commandes });
  });

  // GET /api/v1/commandes/:codeCommande
  app.get('/:codeCommande', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeCommande } = request.params as { codeCommande: string };
    const commande = await prisma.commandes.findUnique({ 
      where: { [COLUMNS.CODE_COMMANDE]: codeCommande }, 
      include: { restaurants: true, clients: true, ligne_commandes: true } 
    });
    if (!commande) return reply.status(404).send({ success: false, message: 'Not found' });
    return reply.send({ success: true, data: commande });
  });

  // POST /api/v1/commandes
  app.post('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const data = request.body as Record<string, unknown>;
    const count = await prisma.commandes.count();
    const codeCommande = `CMD_${(count + 1).toString().padStart(4, '0')}`;
    const commande = await prisma.commandes.create({ 
      data: { 
        ...data, 
        [COLUMNS.CODE_COMMANDE]: codeCommande,
        [COLUMNS.STATUT_COMMANDE]: STATUT_COMMANDE.EN_ATTENTE
      } as never 
    });
    return reply.status(201).send({ success: true, data: commande });
  });

  // PUT /api/v1/commandes/:codeCommande
  app.put('/:codeCommande', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeCommande } = request.params as { codeCommande: string };
    const data = request.body as Record<string, unknown>;
    const commande = await prisma.commandes.update({ 
      where: { [COLUMNS.CODE_COMMANDE]: codeCommande }, 
      data: data as never 
    });
    return reply.send({ success: true, data: commande });
  });

  // DELETE /api/v1/commandes/:codeCommande
  app.delete('/:codeCommande', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeCommande } = request.params as { codeCommande: string };
    await prisma.commandes.delete({ where: { [COLUMNS.CODE_COMMANDE]: codeCommande } });
    return reply.send({ success: true, message: 'Deleted' });
  });
};
