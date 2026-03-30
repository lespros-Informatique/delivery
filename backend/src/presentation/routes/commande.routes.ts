/**
 * Commande Routes
 * ===========================================
 * Presentation Layer - Routes
 * Endpoints: /api/v1/commandes/*
 * Uses constants from tables.ts for table and column names
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { COLUMNS } from '../../shared/constants/tables.js';
import { authenticate } from '../middleware/authenticate.middleware.js';
import { commandeService } from '../../shared/services/base-crud.service.js';
import { cacheService } from '../../shared/services/cache.service.js';

const CMD_CACHE_KEY = 'commandes:';
const CMD_CACHE_TTL = 60 * 1000; // 1 minute (données plus volatiles)

export const commandeRoutes = async (app: FastifyInstance): Promise<void> => {

  // GET /api/v1/commandes
  app.get('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const cacheKey = `${CMD_CACHE_KEY}all`;
    const cached = cacheService.get(cacheKey);
    if (cached) return reply.send({ success: true, data: cached });

    const result = await commandeService.findAll({
      include: { restaurants: true, clients: true }
    });

    cacheService.set(cacheKey, result.data, CMD_CACHE_TTL);
    return reply.send({ success: true, data: result.data });
  });

  // GET /api/v1/commandes/:codeCommande
  app.get('/:codeCommande', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeCommande } = request.params as { codeCommande: string };
    const cacheKey = `${CMD_CACHE_KEY}${codeCommande}`;
    const cached = cacheService.get(cacheKey);
    if (cached) return reply.send({ success: true, data: cached });

    const commande = await commandeService.findByCode(codeCommande, {
      restaurants: true,
      clients: true,
      ligne_commandes: true
    });

    if (!commande) return reply.status(404).send({ success: false, message: 'Not found' });

    cacheService.set(cacheKey, commande, CMD_CACHE_TTL);
    return reply.send({ success: true, data: commande });
  });

  // POST /api/v1/commandes
  app.post('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const data = request.body as any;
    const commande = await commandeService.create(data, {
      [COLUMNS.STATUT_COMMANDE]: 'en_attente'
    });
    cacheService.delByPrefix(CMD_CACHE_KEY);
    return reply.status(201).send({ success: true, data: commande });
  });

  // PUT /api/v1/commandes/:codeCommande
  app.put('/:codeCommande', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeCommande } = request.params as { codeCommande: string };
    const data = request.body as any;
    const commande = await commandeService.updateByCode(codeCommande, data);
    cacheService.delByPrefix(CMD_CACHE_KEY);
    return reply.send({ success: true, data: commande });
  });

  // DELETE /api/v1/commandes/:codeCommande
  app.delete('/:codeCommande', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeCommande } = request.params as { codeCommande: string };
    await commandeService.deleteByCode(codeCommande);
    cacheService.delByPrefix(CMD_CACHE_KEY);
    return reply.send({ success: true, message: 'Deleted' });
  });
};
