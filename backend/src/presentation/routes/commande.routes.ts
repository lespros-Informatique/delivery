import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../infrastructure/database/prisma.service.js';

const authenticate = async (request: FastifyRequest): Promise<void> => { try { await request.jwtVerify(); } catch (err) { throw err; } };

export const commandeRoutes = async (app: FastifyInstance): Promise<void> => {
  app.get('/', { preHandler: [authenticate] }, async (request, reply) => {
    const commandes = await prisma.commande.findMany({ include: { restaurant: true, client: true } });
    return reply.send({ success: true, data: commandes });
  });
  app.get('/:codeCommande', { preHandler: [authenticate] }, async (request: FastifyRequest<{ Params: { codeCommande: string } }>, reply) => {
    const commande = await prisma.commande.findUnique({ where: { codeCommande: request.params.codeCommande }, include: { ligneCommandes: { include: { produit: true } }, client: true, livraison: true, paiement: true } });
    if (!commande) return reply.status(404).send({ success: false, message: 'Not found' });
    return reply.send({ success: true, data: commande });
  });
  app.post('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply) => {
    const data = request.body as Record<string, unknown>;
    const count = await prisma.commande.count();
    const codeCommande = `CMD_${(count + 1).toString().padStart(4, '0')}`;
    const commande = await prisma.commande.create({ data: { ...data, codeCommande } as never });
    return reply.status(201).send({ success: true, data: commande });
  });
  app.put('/:codeCommande', { preHandler: [authenticate] }, async (request: FastifyRequest<{ Params: { codeCommande: string } }>, reply) => {
    const data = request.body as Record<string, unknown>;
    const commande = await prisma.commande.update({ where: { codeCommande: request.params.codeCommande }, data: data as never });
    return reply.send({ success: true, data: commande });
  });
  app.delete('/:codeCommande', { preHandler: [authenticate] }, async (request: FastifyRequest<{ Params: { codeCommande: string } }>, reply) => {
    await prisma.commande.delete({ where: { codeCommande: request.params.codeCommande } });
    return reply.send({ success: true, message: 'Deleted' });
  });
};
