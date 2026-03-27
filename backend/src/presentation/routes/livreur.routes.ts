import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../infrastructure/database/prisma.service.js';
import { TABLES, COLUMNS, ETAT_DEFAUT } from '../../shared/constants/tables.js';
import { authenticate } from '../middleware/authenticate.middleware.js';
import { z } from 'zod';

// Validation schemas
const createLivreurSchema = z.object({
  nom_livreur: z.string().min(1),
  prenom_livreur: z.string().optional().nullable(),
  email_livreur: z.string().email().optional().or(z.literal('')).nullable(),
  telephone_livreur: z.string().optional().nullable(),
  restaurant_code: z.string().optional().nullable(),
  moyen_transport: z.string().optional().nullable(),
  plaque_vehicule: z.string().optional().nullable(),
  statut_livreurs: z.boolean().optional(),
});

const updateLivreurSchema = z.object({
  nom_livreur: z.string().min(1).optional(),
  prenom_livreur: z.string().optional().nullable(),
  email_livreur: z.string().email().optional().or(z.literal('')).nullable(),
  telephone_livreur: z.string().optional().nullable(),
  restaurant_code: z.string().optional().nullable(),
  moyen_transport: z.string().optional().nullable(),
  plaque_vehicule: z.string().optional().nullable(),
  statut_livreurs: z.boolean().optional(),
});

interface GetLivreursQuery {
  page?: string;
  limit?: string;
  search?: string;
}

/**
 * Register routes
 */
export const livreurRoutes = async (app: FastifyInstance): Promise<void> => {
  // GET /api/v1/livreurs
  app.get<{ Querystring: GetLivreursQuery }>(
    '/',
    { preHandler: [authenticate] },
    async (request, reply) => {
      const page = parseInt(request.query.page || '1', 10);
      const limit = parseInt(request.query.limit || '10', 10);
      const search = request.query.search || '';

      // Build where clause only if there's a search term
      const searchCondition = search
        ? {
          OR: [
            { nom_livreur: { contains: search } },
            { prenom_livreur: { contains: search } },
            { telephone_livreur: { contains: search } },
            { email_livreur: { contains: search } },
          ],
        }
        : undefined;

      // Get total count using Prisma count
      const total = await prisma.livreurs.count({
        where: searchCondition,
      });

      // Get paginated livreurs with select for efficiency or include depending on relations
      const livreurs = await prisma.livreurs.findMany({
        where: searchCondition,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { created_at_livreur: 'desc' },
        include: { restaurants: true }
      });

      return reply.send({
        success: true,
        data: livreurs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    }
  );

  // GET /api/v1/livreurs/:codeLivreur
  app.get<{ Params: { codeLivreur: string } }>(
    '/:codeLivreur',
    { preHandler: [authenticate] },
    async (request, reply) => {
      const { codeLivreur } = request.params;

      // Get livreur by code
      const livreur = await prisma.livreurs.findUnique({
        where: { [COLUMNS.CODE_LIVREUR]: codeLivreur },
        include: { livraisons: true }
      });

      if (!livreur) {
        return reply.status(404).send({
          success: false,
          message: 'Livreur not found',
        });
      }

      return reply.send({
        success: true,
        data: livreur,
      });
    }
  );

  // POST /api/v1/livreurs
  app.post(
    '/',
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        app.log.info({ body: request.body }, 'Creating livreur - Request body');
        const body = createLivreurSchema.parse(request.body);

        // Convertir les chaînes vides en null pour éviter les erreurs de clé étrangère
        if (body.restaurant_code === '') body.restaurant_code = null;
        if (body.email_livreur === '') body.email_livreur = null;

        // Generate code using constant prefix
        const count = await prisma.livreurs.count();
        const codeLivreur = `LIV_${(count + 1).toString().padStart(4, '0')}`;

        const createData: Record<string, unknown> = {
          ...body,
          [COLUMNS.CODE_LIVREUR]: codeLivreur
        };

        // Convertir boolean en Int pour Prisma
        if (body.statut_livreurs !== undefined) {
          createData.statut_livreurs = body.statut_livreurs ? ETAT_DEFAUT.ACTIF : ETAT_DEFAUT.INACTIF;
        } else {
          createData.statut_livreurs = ETAT_DEFAUT.ACTIF;
        }

        const livreur = await prisma.livreurs.create({
          data: createData as never,
        });

        return reply.status(201).send({
          success: true,
          data: livreur,
        });
      } catch (error: unknown) {
        app.log.error(error, 'Error creating livreur');
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            success: false,
            message: 'Validation failed',
            errors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
          });
        }
        return reply.status(500).send({
          success: false,
          message: error instanceof Error ? error.message : 'Erreur serveur',
        });
      }
    }
  );

  // PUT /api/v1/livreurs/:codeLivreur
  app.put<{ Params: { codeLivreur: string } }>(
    '/:codeLivreur',
    { preHandler: [authenticate] },
    async (request, reply) => {
      try {
        const { codeLivreur } = request.params;
        const body = updateLivreurSchema.parse(request.body);

        // Convertir les chaînes vides en null pour éviter les erreurs de clé étrangère
        if (body.restaurant_code === '') body.restaurant_code = null;
        if (body.email_livreur === '') body.email_livreur = null;

        // Build update data
        const updateData: Record<string, unknown> = { ...body };
        
        // Convertir le boolean en int
        if (body.statut_livreurs !== undefined) {
           updateData.statut_livreurs = body.statut_livreurs ? ETAT_DEFAUT.ACTIF : ETAT_DEFAUT.INACTIF;
        }

        const livreur = await prisma.livreurs.update({
          where: { [COLUMNS.CODE_LIVREUR]: codeLivreur },
          data: updateData as never,
        });

        return reply.send({
          success: true,
          data: livreur,
        });
      } catch (error: unknown) {
        app.log.error(error, 'Error updating livreur');
        if (error instanceof z.ZodError) {
          app.log.error(error.errors, 'Zod validation PUT failed');
          return reply.status(400).send({
            success: false,
            message: 'Validation failed',
            errors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
          });
        }
        return reply.status(500).send({
          success: false,
          message: error instanceof Error ? error.message : 'Erreur serveur',
        });
      }
    }
  );

  // DELETE /api/v1/livreurs/:codeLivreur
  app.delete<{ Params: { codeLivreur: string } }>(
    '/:codeLivreur',
    { preHandler: [authenticate] },
    async (request, reply) => {
      const { codeLivreur } = request.params;

      // Soft delete pour empêcher la suppression définitive et respecter l'historique
      await prisma.livreurs.update({
        where: { [COLUMNS.CODE_LIVREUR]: codeLivreur },
        data: { statut_livreurs: ETAT_DEFAUT.INACTIF } as never
      });

      return reply.send({
        success: true,
        message: 'Livreur archivé',
      });
    }
  );
};
