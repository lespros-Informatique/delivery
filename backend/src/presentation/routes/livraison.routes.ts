import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../infrastructure/database/prisma.service.js';

const authenticate = async (request: FastifyRequest): Promise<void> => { try { await request.jwtVerify(); } catch (err) { throw err; } };

export const livraisonRoutes = async (app: FastifyInstance): Promise<void> => {
  app.get('/', { preHandler: [authenticate] }, async (request, reply) => {
    const livraisons = await prisma.livraison.findMany({ include: { commande: true, livreur: true } });
    return reply.send({ success: true, data: livraisons });
  });
  app.get('/:codeLivraison', { preHandler: [authenticate] }, async (request: FastifyRequest<{ Params: { codeLivraison: string } }>, reply) => {
    const livraison = await prisma.livraison.findUnique({ where: { codeLivraison: request.params.codeLivraison }, include: { positions: true, livreur: true, commande: true } });
    if (!livraison) return reply.status(404).send({ success: false, message: 'Not found' });
    return reply.send({ success: true, data: livraison });
  });
  app.post('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply) => {
    const data = request.body as Record<string, unknown>;
    const count = await prisma.livraison.count();
    const codeLivraison = `LIVR_${(count + 1).toString().padStart(4, '0')}`;
    const livraison = await prisma.livraison.create({ data: { ...data, codeLivraison } as never });
    return reply.status(201).send({ success: true, data: livraison });
  });
  app.put('/:codeLivraison', { preHandler: [authenticate] }, async (request: FastifyRequest<{ Params: { codeLivraison: string } }>, reply) => {
    const data = request.body as Record<string, unknown>;
    const livraison = await prisma.livraison.update({ where: { codeLivraison: request.params.codeLivraison }, data: data as never });
    return reply.send({ success: true, data: livraison });
  });
};
