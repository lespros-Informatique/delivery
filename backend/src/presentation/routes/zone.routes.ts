import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../infrastructure/database/prisma.service.js';

const authenticate = async (request: FastifyRequest): Promise<void> => { try { await request.jwtVerify(); } catch (err) { throw err; } };

export const zoneRoutes = async (app: FastifyInstance): Promise<void> => {
  app.get('/', async (request, reply) => {
    const zones = await prisma.zoneLivraison.findMany({ include: { ville: true } });
    return reply.send({ success: true, data: zones });
  });
  app.get('/:codeZone', async (request: FastifyRequest<{ Params: { codeZone: string } }>, reply) => {
    const zone = await prisma.zoneLivraison.findUnique({ where: { codeZone: request.params.codeZone } });
    if (!zone) return reply.status(404).send({ success: false, message: 'Not found' });
    return reply.send({ success: true, data: zone });
  });
  app.post('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply) => {
    const data = request.body as Record<string, unknown>;
    const count = await prisma.zoneLivraison.count();
    const codeZone = `ZONE_${(count + 1).toString().padStart(4, '0')}`;
    const zone = await prisma.zoneLivraison.create({ data: { ...data, codeZone } as never });
    return reply.status(201).send({ success: true, data: zone });
  });
};
