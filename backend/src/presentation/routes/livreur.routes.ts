import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../infrastructure/database/prisma.service.js';

const authenticate = async (request: FastifyRequest): Promise<void> => { try { await request.jwtVerify(); } catch (err) { throw err; } };

export const livreurRoutes = async (app: FastifyInstance): Promise<void> => {
  app.get('/', { preHandler: [authenticate] }, async (request, reply) => {
    const livreurs = await prisma.livreur.findMany({ include: { restaurant: true, wallet: true } });
    return reply.send({ success: true, data: livreurs });
  });
  app.get('/:codeLivreur', { preHandler: [authenticate] }, async (request: FastifyRequest<{ Params: { codeLivreur: string } }>, reply) => {
    const livreur = await prisma.livreur.findUnique({ where: { codeLivreur: request.params.codeLivreur }, include: { wallet: true, livraisons: true } });
    if (!livreur) return reply.status(404).send({ success: false, message: 'Not found' });
    return reply.send({ success: true, data: livreur });
  });
  app.post('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply) => {
    const data = request.body as Record<string, unknown>;
    const count = await prisma.livreur.count();
    const codeLivreur = `LIV_${(count + 1).toString().padStart(4, '0')}`;
    const livreur = await prisma.livreur.create({ data: { ...data, codeLivreur } as never });
    return reply.status(201).send({ success: true, data: livreur });
  });
  app.put('/:codeLivreur', { preHandler: [authenticate] }, async (request: FastifyRequest<{ Params: { codeLivreur: string } }>, reply) => {
    const data = request.body as Record<string, unknown>;
    const livreur = await prisma.livreur.update({ where: { codeLivreur: request.params.codeLivreur }, data: data as never });
    return reply.send({ success: true, data: livreur });
  });
  app.delete('/:codeLivreur', { preHandler: [authenticate] }, async (request: FastifyRequest<{ Params: { codeLivreur: string } }>, reply) => {
    await prisma.livreur.delete({ where: { codeLivreur: request.params.codeLivreur } });
    return reply.send({ success: true, message: 'Deleted' });
  });
};
