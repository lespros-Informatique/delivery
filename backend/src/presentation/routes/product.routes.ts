/**
 * Product Routes
 * ===========================================
 * Presentation Layer - Routes
 * Endpoints: /api/v1/products/*
 * Uses constants from tables.ts for table and column names
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../infrastructure/database/prisma.service.js';
import { TABLES, COLUMNS } from '../../shared/constants/tables.js';
import { authenticate } from '../middleware/authenticate.middleware.js';

export const productRoutes = async (app: FastifyInstance): Promise<void> => {
  
  // GET /api/v1/products
  app.get('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const products = await prisma.produits.findMany({ include: { categories: true, restaurants: true } });
    return reply.send({ success: true, data: products });
  });

  // GET /api/v1/products/:codeProduit
  app.get('/:codeProduit', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeProduit } = request.params as { codeProduit: string };
    const product = await prisma.produits.findUnique({ 
      where: { [COLUMNS.CODE_PRODUIT]: codeProduit }, 
      include: { categories: true, restaurants: true } 
    });
    if (!product) return reply.status(404).send({ success: false, message: 'Not found' });
    return reply.send({ success: true, data: product });
  });

  // POST /api/v1/products
  app.post('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const data = request.body as Record<string, unknown>;
    const count = await prisma.produits.count();
    const codeProduit = `PROD_${(count + 1).toString().padStart(4, '0')}`;
    const product = await prisma.produits.create({ 
      data: { ...data, [COLUMNS.CODE_PRODUIT]: codeProduit } as never 
    });
    return reply.status(201).send({ success: true, data: product });
  });

  // PUT /api/v1/products/:codeProduit
  app.put('/:codeProduit', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeProduit } = request.params as { codeProduit: string };
    const data = request.body as Record<string, unknown>;
    const product = await prisma.produits.update({ 
      where: { [COLUMNS.CODE_PRODUIT]: codeProduit }, 
      data: data as never 
    });
    return reply.send({ success: true, data: product });
  });

  // DELETE /api/v1/products/:codeProduit
  app.delete('/:codeProduit', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeProduit } = request.params as { codeProduit: string };
    await prisma.produits.delete({ where: { [COLUMNS.CODE_PRODUIT]: codeProduit } });
    return reply.send({ success: true, message: 'Deleted' });
  });
};
