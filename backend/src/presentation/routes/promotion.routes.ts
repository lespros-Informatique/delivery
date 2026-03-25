import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../infrastructure/database/prisma.service.js';

const authenticate = async (request: FastifyRequest): Promise<void> => { try { await request.jwtVerify(); } catch (err) { throw err; } };

export const promotionRoutes = async (app: FastifyInstance): Promise<void> => {
  app.get('/', async (request, reply) => {
    const promotions = await prisma.promotion.findMany({ include: { restaurant: true } });
    return reply.send({ success: true, data: promotions });
  });
  app.get('/:codePromotion', async (request: FastifyRequest<{ Params: { codePromotion: string } }>, reply) => {
    const promotion = await prisma.promotion.findUnique({ where: { codePromotion: request.params.codePromotion } });
    if (!promotion) return reply.status(404).send({ success: false, message: 'Not found' });
    return reply.send({ success: true, data: promotion });
  });
  app.post('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply) => {
    const data = request.body as Record<string, unknown>;
    const count = await prisma.promotion.count();
    const codePromotion = `PROMO_${(count + 1).toString().padStart(4, '0')}`;
    const promotion = await prisma.promotion.create({ data: { ...data, codePromotion } as never });
    return reply.status(201).send({ success: true, data: promotion });
  });
};
