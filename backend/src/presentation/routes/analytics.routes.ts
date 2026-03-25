import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../infrastructure/database/prisma.service.js';

const authenticate = async (request: FastifyRequest): Promise<void> => { try { await request.jwtVerify(); } catch (err) { throw err; } };

export const analyticsRoutes = async (app: FastifyInstance): Promise<void> => {
  app.get('/', { preHandler: [authenticate] }, async (request, reply) => {
    const analytics = await prisma.analytics.findMany({ orderBy: { dateAnalytics: 'desc' }, take: 30 });
    return reply.send({ success: true, data: analytics });
  });
  app.get('/summary', { preHandler: [authenticate] }, async (request, reply) => {
    const [totalUsers, totalRestaurants, totalCommandes, totalLivraisons] = await Promise.all([
      prisma.user.count(),
      prisma.restaurant.count(),
      prisma.commande.count(),
      prisma.livraison.count(),
    ]);
    return reply.send({
      success: true,
      data: { totalUsers, totalRestaurants, totalCommandes, totalLivraisons }
    });
  });
};
