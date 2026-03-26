/**
 * Livreur Routes
 * ===========================================
 * Presentation Layer - Routes
 * Endpoints: /api/v1/livreurs/*
 * Uses constants from tables.ts for table and column names
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../infrastructure/database/prisma.service.js';
import { TABLES, COLUMNS } from '../../shared/constants/tables.js';
import { authenticate } from '../middleware/authenticate.middleware.js';

export const livreurRoutes = async (app: FastifyInstance): Promise<void> => {
  
  // GET /api/v1/livreurs
  app.get('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const livreurs = await prisma.livreurs.findMany({ include: { restaurants: true } });
    return reply.send({ success: true, data: livreurs });
  });

  // GET /api/v1/livreurs/:codeLivreur
  app.get('/:codeLivreur', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeLivreur } = request.params as { codeLivreur: string };
    const livreur = await prisma.livreurs.findUnique({ 
      where: { [COLUMNS.CODE_LIVREUR]: codeLivreur }, 
      include: { livraisons: true } 
    });
    if (!livreur) return reply.status(404).send({ success: false, message: 'Not found' });
    return reply.send({ success: true, data: livreur });
  });

  // POST /api/v1/livreurs
  app.post('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const data = request.body as Record<string, unknown>;
    const count = await prisma.livreurs.count();
    const codeLivreur = `LIV_${(count + 1).toString().padStart(4, '0')}`;
    const livreur = await prisma.livreurs.create({ 
      data: { ...data, [COLUMNS.CODE_LIVREUR]: codeLivreur } as never 
    });
    return reply.status(201).send({ success: true, data: livreur });
  });

  // PUT /api/v1/livreurs/:codeLivreur
  app.put('/:codeLivreur', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeLivreur } = request.params as { codeLivreur: string };
    const data = request.body as Record<string, unknown>;
    const livreur = await prisma.livreurs.update({ 
      where: { [COLUMNS.CODE_LIVREUR]: codeLivreur }, 
      data: data as never 
    });
    return reply.send({ success: true, data: livreur });
  });

  // DELETE /api/v1/livreurs/:codeLivreur
  app.delete('/:codeLivreur', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeLivreur } = request.params as { codeLivreur: string };
    await prisma.livreurs.delete({ where: { [COLUMNS.CODE_LIVREUR]: codeLivreur } });
    return reply.send({ success: true, message: 'Deleted' });
  });
};
