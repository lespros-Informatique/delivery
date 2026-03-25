import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../infrastructure/database/prisma.service.js';

const authenticate = async (request: FastifyRequest): Promise<void> => { try { await request.jwtVerify(); } catch (err) { throw err; } };

export const paiementRoutes = async (app: FastifyInstance): Promise<void> => {
  app.get('/', { preHandler: [authenticate] }, async (request, reply) => {
    const paiements = await prisma.paiement.findMany({ include: { commande: true } });
    return reply.send({ success: true, data: paiements });
  });
  app.get('/:codePaiement', { preHandler: [authenticate] }, async (request: FastifyRequest<{ Params: { codePaiement: string } }>, reply) => {
    const paiement = await prisma.paiement.findUnique({ where: { codePaiement: request.params.codePaiement } });
    if (!paiement) return reply.status(404).send({ success: false, message: 'Not found' });
    return reply.send({ success: true, data: paiement });
  });
  app.post('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply) => {
    const data = request.body as Record<string, unknown>;
    const count = await prisma.paiement.count();
    const codePaiement = `PAIE_${(count + 1).toString().padStart(4, '0')}`;
    const paiement = await prisma.paiement.create({ data: { ...data, codePaiement } as never });
    return reply.status(201).send({ success: true, data: paiement });
  });
};
