/**
 * Restaurant Routes
 * ===========================================
 * Presentation Layer - Routes
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../infrastructure/database/prisma.service.js';

const authenticate = async (request: FastifyRequest): Promise<void> => {
  try {
    await request.jwtVerify();
  } catch (err) {
    throw err;
  }
};

export const restaurantRoutes = async (app: FastifyInstance): Promise<void> => {
  // GET /api/v1/restaurants
  app.get('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const restaurants = await prisma.restaurant.findMany({
      include: { ville: true, famille: true },
    });
    return reply.send({ success: true, data: restaurants });
  });

  // GET /api/v1/restaurants/:codeRestaurant
  app.get('/:codeRestaurant', { preHandler: [authenticate] }, async (request: FastifyRequest<{ Params: { codeRestaurant: string } }>, reply: FastifyReply) => {
    const { codeRestaurant } = request.params;
    const restaurant = await prisma.restaurant.findUnique({
      where: { codeRestaurant },
      include: { ville: true, famille: true, categories: true },
    });
    if (!restaurant) {
      return reply.status(404).send({ success: false, message: 'Restaurant not found' });
    }
    return reply.send({ success: true, data: restaurant });
  });

  // POST /api/v1/restaurants
  app.post('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const data = request.body as Record<string, unknown>;
    const count = await prisma.restaurant.count();
    const codeRestaurant = `RESTO_${(count + 1).toString().padStart(4, '0')}`;
    const restaurant = await prisma.restaurant.create({
      data: { ...data, codeRestaurant } as never,
    });
    return reply.status(201).send({ success: true, data: restaurant });
  });

  // PUT /api/v1/restaurants/:codeRestaurant
  app.put('/:codeRestaurant', { preHandler: [authenticate] }, async (request: FastifyRequest<{ Params: { codeRestaurant: string } }>, reply: FastifyReply) => {
    const { codeRestaurant } = request.params;
    const data = request.body as Record<string, unknown>;
    const restaurant = await prisma.restaurant.update({
      where: { codeRestaurant },
      data: data as never,
    });
    return reply.send({ success: true, data: restaurant });
  });

  // DELETE /api/v1/restaurants/:codeRestaurant
  app.delete('/:codeRestaurant', { preHandler: [authenticate] }, async (request: FastifyRequest<{ Params: { codeRestaurant: string } }>, reply: FastifyReply) => {
    const { codeRestaurant } = request.params;
    await prisma.restaurant.delete({ where: { codeRestaurant } });
    return reply.send({ success: true, message: 'Restaurant deleted' });
  });
};
