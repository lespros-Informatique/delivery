import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../infrastructure/database/prisma.service.js';

const authenticate = async (request: FastifyRequest): Promise<void> => { try { await request.jwtVerify(); } catch (err) { throw err; } };

export const villeRoutes = async (app: FastifyInstance): Promise<void> => {
  app.get('/', async (request, reply) => {
    const villes = await prisma.ville.findMany();
    return reply.send({ success: true, data: villes });
  });
  app.get('/:codeVille', async (request: FastifyRequest<{ Params: { codeVille: string } }>, reply) => {
    const ville = await prisma.ville.findUnique({ where: { codeVille: request.params.codeVille }, include: { zonesLivraison: true } });
    if (!ville) return reply.status(404).send({ success: false, message: 'Not found' });
    return reply.send({ success: true, data: ville });
  });
  app.post('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply) => {
    const data = request.body as Record<string, unknown>;
    const count = await prisma.ville.count();
    const codeVille = `VILLE_${(count + 1).toString().padStart(4, '0')}`;
    const ville = await prisma.ville.create({ data: { ...data, codeVille } as never });
    return reply.status(201).send({ success: true, data: ville });
  });
};
