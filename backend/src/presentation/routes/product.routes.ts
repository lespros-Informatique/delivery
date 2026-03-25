import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../infrastructure/database/prisma.service.js';

const authenticate = async (request: FastifyRequest): Promise<void> => { try { await request.jwtVerify(); } catch (err) { throw err; } };

export const productRoutes = async (app: FastifyInstance): Promise<void> => {
  app.get('/', { preHandler: [authenticate] }, async (request, reply) => {
    const products = await prisma.product.findMany({ include: { restaurant: true, category: true } });
    return reply.send({ success: true, data: products });
  });

  app.get('/:codeProduit', { preHandler: [authenticate] }, async (request: FastifyRequest<{ Params: { codeProduit: string } }>, reply) => {
    const product = await prisma.product.findUnique({ where: { codeProduit: request.params.codeProduit } });
    if (!product) return reply.status(404).send({ success: false, message: 'Not found' });
    return reply.send({ success: true, data: product });
  });

  app.post('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply) => {
    const data = request.body as Record<string, unknown>;
    const count = await prisma.product.count();
    const codeProduit = `PROD_${(count + 1).toString().padStart(4, '0')}`;
    const product = await prisma.product.create({ data: { ...data, codeProduit } as never });
    return reply.status(201).send({ success: true, data: product });
  });

  app.put('/:codeProduit', { preHandler: [authenticate] }, async (request: FastifyRequest<{ Params: { codeProduit: string } }>, reply) => {
    const data = request.body as Record<string, unknown>;
    const product = await prisma.product.update({ where: { codeProduit: request.params.codeProduit }, data: data as never });
    return reply.send({ success: true, data: product });
  });

  app.delete('/:codeProduit', { preHandler: [authenticate] }, async (request: FastifyRequest<{ Params: { codeProduit: string } }>, reply) => {
    await prisma.product.delete({ where: { codeProduit: request.params.codeProduit } });
    return reply.send({ success: true, message: 'Deleted' });
  });
};
