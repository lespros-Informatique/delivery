import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../infrastructure/database/prisma.service.js';

const authenticate = async (request: FastifyRequest): Promise<void> => { try { await request.jwtVerify(); } catch (err) { throw err; } };

export const clientRoutes = async (app: FastifyInstance): Promise<void> => {
  app.get('/', { preHandler: [authenticate] }, async (request, reply) => {
    const clients = await prisma.client.findMany({ include: { restaurant: true } });
    return reply.send({ success: true, data: clients });
  });
  app.get('/:codeClient', { preHandler: [authenticate] }, async (request: FastifyRequest<{ Params: { codeClient: string } }>, reply) => {
    const client = await prisma.client.findUnique({ where: { codeClient: request.params.codeClient }, include: { commandes: true } });
    if (!client) return reply.status(404).send({ success: false, message: 'Not found' });
    return reply.send({ success: true, data: client });
  });
  app.post('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply) => {
    const data = request.body as Record<string, unknown>;
    const count = await prisma.client.count();
    const codeClient = `CLI_${(count + 1).toString().padStart(4, '0')}`;
    const client = await prisma.client.create({ data: { ...data, codeClient } as never });
    return reply.status(201).send({ success: true, data: client });
  });
  app.put('/:codeClient', { preHandler: [authenticate] }, async (request: FastifyRequest<{ Params: { codeClient: string } }>, reply) => {
    const data = request.body as Record<string, unknown>;
    const client = await prisma.client.update({ where: { codeClient: request.params.codeClient }, data: data as never });
    return reply.send({ success: true, data: client });
  });
  app.delete('/:codeClient', { preHandler: [authenticate] }, async (request: FastifyRequest<{ Params: { codeClient: string } }>, reply) => {
    await prisma.client.delete({ where: { codeClient: request.params.codeClient } });
    return reply.send({ success: true, message: 'Deleted' });
  });
};
