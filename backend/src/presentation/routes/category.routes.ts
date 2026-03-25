import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../infrastructure/database/prisma.service.js';

const authenticate = async (request: FastifyRequest): Promise<void> => {
  try { await request.jwtVerify(); } catch (err) { throw err; }
};

export const categoryRoutes = async (app: FastifyInstance): Promise<void> => {
  app.get('/', { preHandler: [authenticate] }, async (request, reply) => {
    const categories = await prisma.category.findMany({ include: { restaurant: true } });
    return reply.send({ success: true, data: categories });
  });

  app.get('/:codeCategorie', { preHandler: [authenticate] }, async (request: FastifyRequest<{ Params: { codeCategorie: string } }>, reply) => {
    const category = await prisma.category.findUnique({ where: { codeCategorie: request.params.codeCategorie }, include: { products: true } });
    if (!category) return reply.status(404).send({ success: false, message: 'Not found' });
    return reply.send({ success: true, data: category });
  });

  app.post('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply) => {
    const data = request.body as Record<string, unknown>;
    const count = await prisma.category.count();
    const codeCategorie = `CAT_${(count + 1).toString().padStart(4, '0')}`;
    const category = await prisma.category.create({ data: { ...data, codeCategorie } as never });
    return reply.status(201).send({ success: true, data: category });
  });

  app.put('/:codeCategorie', { preHandler: [authenticate] }, async (request: FastifyRequest<{ Params: { codeCategorie: string } }>, reply) => {
    const data = request.body as Record<string, unknown>;
    const category = await prisma.category.update({ where: { codeCategorie: request.params.codeCategorie }, data: data as never });
    return reply.send({ success: true, data: category });
  });

  app.delete('/:codeCategorie', { preHandler: [authenticate] }, async (request: FastifyRequest<{ Params: { codeCategorie: string } }>, reply) => {
    await prisma.category.delete({ where: { codeCategorie: request.params.codeCategorie } });
    return reply.send({ success: true, message: 'Deleted' });
  });
};
