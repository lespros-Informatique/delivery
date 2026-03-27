/**
 * Product Routes
 * ===========================================
 * Presentation Layer - Routes
 * Endpoints: /api/v1/products/*
 * Uses constants from tables.ts for table and column names
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { COLUMNS } from '../../shared/constants/tables.js';
import { authenticate } from '../middleware/authenticate.middleware.js';
import { productService } from '../../shared/services/base-crud.service.js';
import { cacheService } from '../../shared/services/cache.service.js';

const PROD_CACHE_KEY = 'products:';
const PROD_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const productRoutes = async (app: FastifyInstance): Promise<void> => {

  // GET /api/v1/products
  app.get('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const cacheKey = `${PROD_CACHE_KEY}all`;
    const cached = cacheService.get(cacheKey);
    if (cached) return reply.send({ success: true, data: cached });

    const result = await productService.findAll({
      include: { categories: true, restaurants: true }
    });

    cacheService.set(cacheKey, result.data, PROD_CACHE_TTL);
    return reply.send({ success: true, data: result.data });
  });

  // GET /api/v1/products/:codeProduit
  app.get('/:codeProduit', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeProduit } = request.params as { codeProduit: string };
    const cacheKey = `${PROD_CACHE_KEY}${codeProduit}`;
    const cached = cacheService.get(cacheKey);
    if (cached) return reply.send({ success: true, data: cached });

    const product = await productService.findByCode(codeProduit, {
      categories: true,
      restaurants: true
    });

    if (!product) return reply.status(404).send({ success: false, message: 'Not found' });

    cacheService.set(cacheKey, product, PROD_CACHE_TTL);
    return reply.send({ success: true, data: product });
  });

  // POST /api/v1/products
  app.post('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const data = request.body as any;
    const product = await productService.create(data);
    cacheService.delByPrefix(PROD_CACHE_KEY);
    return reply.status(201).send({ success: true, data: product });
  });

  // PUT /api/v1/products/:codeProduit
  app.put('/:codeProduit', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeProduit } = request.params as { codeProduit: string };
    const data = request.body as any;
    const product = await productService.updateByCode(codeProduit, data);
    cacheService.delByPrefix(PROD_CACHE_KEY);
    return reply.send({ success: true, data: product });
  });

  // DELETE /api/v1/products/:codeProduit
  app.delete('/:codeProduit', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { codeProduit } = request.params as { codeProduit: string };
    await productService.deleteByCode(codeProduit);
    cacheService.delByPrefix(PROD_CACHE_KEY);
    return reply.send({ success: true, message: 'Deleted' });
  });
};
