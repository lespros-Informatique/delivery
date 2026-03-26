/**
 * Restaurant Routes
 * ===========================================
 * Presentation Layer - Routes
 * Endpoints: /api/v1/restaurants/*
 * Uses constants from tables.ts for table and column names
 * Uses Zod validation schemas
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../infrastructure/database/prisma.service.js';
import { COLUMNS } from '../../shared/constants/tables.js';
import { authenticate } from '../middleware/authenticate.middleware.js';

// Validation schemas (inline to avoid import issues)
const createRestaurantSchema = z.object({
  libelle_restaurant: z.string().min(1, 'Le nom du restaurant est requis').max(150),
  description_restaurant: z.string().optional(),
  adresse_restaurant: z.string().optional(),
  user_code: z.string().optional(),
  ville_code: z.string().optional(),
  famille_code: z.string().optional(),
});

const updateRestaurantSchema = z.object({
  libelle_restaurant: z.string().min(1).max(150).optional(),
  description_restaurant: z.string().optional(),
  adresse_restaurant: z.string().optional(),
  etat_restaurant: z.number().int().min(0).max(1).optional(),
});

export const restaurantRoutes = async (app: FastifyInstance): Promise<void> => {
  // GET /api/v1/restaurants - List with pagination
  app.get('/', { preHandler: [authenticate] }, async (request, reply) => {
    const query = request.query as Record<string, string>;
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);
    const search = query.search || '';

    // Build search condition
    const searchCondition = search
      ? {
          OR: [
            { libelle_restaurant: { contains: search } },
            { description_restaurant: { contains: search } },
          ],
        }
      : undefined;

    // Get total count
    const total = await prisma.restaurants.count({ where: searchCondition });

    // Get paginated restaurants
    const restaurants = await prisma.restaurants.findMany({
      where: searchCondition,
      skip: (page - 1) * limit,
      take: limit,
      include: { familles: true },
      orderBy: { created_at_restaurant: 'desc' },
    });

    return reply.send({
      success: true,
      data: {
        restaurants,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  });

  // GET /api/v1/restaurants/:codeRestaurant
  app.get('/:codeRestaurant', { preHandler: [authenticate] }, async (request, reply) => {
    const params = request.params as { codeRestaurant: string };
    const { codeRestaurant } = params;
    
    const restaurant = await prisma.restaurants.findUnique({
      where: { code_restaurant: codeRestaurant },
      include: { familles: true, categories: true },
    });
    
    if (!restaurant) {
      return reply.status(404).send({ success: false, message: 'Restaurant non trouvé' });
    }
    
    return reply.send({ success: true, data: restaurant });
  });

  // POST /api/v1/restaurants - Create with Zod validation
  app.post('/', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      // Validate request body with Zod
      const data = createRestaurantSchema.parse(request.body);
      
      // Generate code
      const count = await prisma.restaurants.count();
      const codeRestaurant = `RESTO_${(count + 1).toString().padStart(4, '0')}`;

      const restaurant = await prisma.restaurants.create({
        data: {
          code_restaurant: codeRestaurant,
          libelle_restaurant: data.libelle_restaurant,
          description_restaurant: data.description_restaurant || undefined,
          adresse_restaurant: data.adresse_restaurant || undefined,
          user_code: data.user_code || undefined,
          ville_code: data.ville_code || undefined,
          famille_code: data.famille_code || undefined,
          etat_restaurant: 1,
        } as any,
      });
      
      return reply.status(201).send({ success: true, data: restaurant });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          message: 'Validation failed',
          errors: error.errors,
        });
      }
      throw error;
    }
  });

  // PUT /api/v1/restaurants/:codeRestaurant - Update with Zod validation
  app.put('/:codeRestaurant', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const params = request.params as { codeRestaurant: string };
      const data = updateRestaurantSchema.parse(request.body);
      
      // Build update data dynamically
      const updateData: Record<string, unknown> = {};
      if (data.libelle_restaurant !== undefined) {
        updateData.libelle_restaurant = data.libelle_restaurant;
      }
      if (data.description_restaurant !== undefined) {
        updateData.description_restaurant = data.description_restaurant;
      }
      if (data.adresse_restaurant !== undefined) {
        updateData.adresse_restaurant = data.adresse_restaurant;
      }
      if (data.etat_restaurant !== undefined) {
        updateData.etat_restaurant = data.etat_restaurant;
      }
      
      const restaurant = await prisma.restaurants.update({
        where: { code_restaurant: params.codeRestaurant },
        data: updateData,
      });
      
      return reply.send({ success: true, data: restaurant });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          message: 'Validation failed',
          errors: error.errors,
        });
      }
      throw error;
    }
  });

  // DELETE /api/v1/restaurants/:codeRestaurant
  app.delete('/:codeRestaurant', { preHandler: [authenticate] }, async (request, reply) => {
    const params = request.params as { codeRestaurant: string };
    
    await prisma.restaurants.delete({ 
      where: { code_restaurant: params.codeRestaurant } 
    });
    
    return reply.send({ success: true, message: 'Restaurant supprimé' });
  });

  // PATCH /api/v1/restaurants/:codeRestaurant/toggle-active
  app.patch('/:codeRestaurant/toggle-active', { preHandler: [authenticate] }, async (request, reply) => {
    const params = request.params as { codeRestaurant: string };
    
    const restaurant = await prisma.restaurants.findUnique({
      where: { code_restaurant: params.codeRestaurant },
    });
    
    if (!restaurant) {
      return reply.status(404).send({ success: false, message: 'Restaurant non trouvé' });
    }
    
    const updated = await prisma.restaurants.update({
      where: { code_restaurant: params.codeRestaurant },
      data: { etat_restaurant: restaurant.etat_restaurant === 1 ? 0 : 1 },
    });
    
    return reply.send({ success: true, data: updated });
  });
};
