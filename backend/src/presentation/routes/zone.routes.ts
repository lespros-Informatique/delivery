/**
 * Zone Routes
 * ===========================================
 * Presentation Layer - Routes
 * Endpoints: /api/v1/zones/*
 * Uses constants from tables.ts for table and column names
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../infrastructure/database/prisma.service.js';
import { TABLES, COLUMNS } from '../../shared/constants/tables.js';
import { authenticate } from '../middleware/authenticate.middleware.js';

export const zoneRoutes = async (app: FastifyInstance): Promise<void> => {
  
  // GET /api/v1/zones
  app.get('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const zones = await prisma.zones_livraison.findMany({ 
      include: { villes: true } 
    });
    return reply.send({ success: true, data: zones });
  });

  // GET /api/v1/zones/:codeZone
  app.get('/:codeZone', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeZone } = request.params as { codeZone: string };
    const zone = await prisma.zones_livraison.findUnique({ 
      where: { [COLUMNS.CODE]: codeZone }, 
      include: { villes: true } 
    });
    if (!zone) return reply.status(404).send({ success: false, message: 'Not found' });
    return reply.send({ success: true, data: zone });
  });

  // POST /api/v1/zones
  app.post('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const data = request.body as Record<string, unknown>;
    const count = await prisma.zones_livraison.count();
    const codeZone = `ZONE_${(count + 1).toString().padStart(4, '0')}`;
    const zone = await prisma.zones_livraison.create({ 
      data: { ...data, [COLUMNS.CODE]: codeZone } as never 
    });
    return reply.status(201).send({ success: true, data: zone });
  });

  // PUT /api/v1/zones/:codeZone
  app.put('/:codeZone', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeZone } = request.params as { codeZone: string };
    const data = request.body as Record<string, unknown>;
    const zone = await prisma.zones_livraison.update({ 
      where: { [COLUMNS.CODE]: codeZone }, 
      data: data as never 
    });
    return reply.send({ success: true, data: zone });
  });

  // DELETE /api/v1/zones/:codeZone
  app.delete('/:codeZone', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeZone } = request.params as { codeZone: string };
    await prisma.zones_livraison.delete({ where: { [COLUMNS.CODE]: codeZone } });
    return reply.send({ success: true, message: 'Deleted' });
  });
};
