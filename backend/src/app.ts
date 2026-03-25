/**
 * Woli Delivery API - Fastify Application Setup
 * ===========================================
 * Clean Architecture - Presentation Layer
 */

import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import fastifyJwt from '@fastify/jwt';

// Routes
import { authRoutes } from './presentation/routes/auth.routes.js';
import { userRoutes } from './presentation/routes/user.routes.js';
import { restaurantRoutes } from './presentation/routes/restaurant.routes.js';
import { categoryRoutes } from './presentation/routes/category.routes.js';
import { productRoutes } from './presentation/routes/product.routes.js';
import { clientRoutes } from './presentation/routes/client.routes.js';
import { commandeRoutes } from './presentation/routes/commande.routes.js';
import { livreurRoutes } from './presentation/routes/livreur.routes.js';
import { livraisonRoutes } from './presentation/routes/livraison.routes.js';
import { paiementRoutes } from './presentation/routes/paiement.routes.js';
import { villeRoutes } from './presentation/routes/ville.routes.js';
import { zoneRoutes } from './presentation/routes/zone.routes.js';
import { promotionRoutes } from './presentation/routes/promotion.routes.js';
import { analyticsRoutes } from './presentation/routes/analytics.routes.js';

// Middleware
import { errorHandler } from './presentation/middleware/error-handler.middleware.js';
import { notFoundHandler } from './presentation/middleware/not-found-handler.middleware.js';

/**
 * Create and configure Fastify instance
 */
export const app = Fastify({
  logger: true,
  trustProxy: true,
  requestIdHeader: 'x-request-id',
});

/**
 * Register plugins (in order)
 */
const registerPlugins = async (): Promise<void> => {
  // Security headers
  await app.register(helmet, {
    contentSecurityPolicy: false,
  });

  // CORS
  await app.register(cors, {
    origin: true,
    credentials: true,
  });

  // JWT configuration with access and refresh tokens
  await app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    sign: {
      expiresIn: process.env.JWT_EXPIRES_IN || '15m', // Access token: 15 minutes
    },
  });

  // Decorate app with JWT utilities
  app.decorate('authenticate', async (request: Fastify.FastifyRequest) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      throw err;
    }
  });
};

/**
 * Register routes
 */
const registerRoutes = async (): Promise<void> => {
  // Health check
  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // API Routes with /api/v1 prefix
  await app.register(authRoutes, { prefix: '/api/v1/auth' });
  await app.register(userRoutes, { prefix: '/api/v1/users' });
  await app.register(restaurantRoutes, { prefix: '/api/v1/restaurants' });
  await app.register(categoryRoutes, { prefix: '/api/v1/categories' });
  await app.register(productRoutes, { prefix: '/api/v1/products' });
  await app.register(clientRoutes, { prefix: '/api/v1/clients' });
  await app.register(commandeRoutes, { prefix: '/api/v1/commandes' });
  await app.register(livreurRoutes, { prefix: '/api/v1/livreurs' });
  await app.register(livraisonRoutes, { prefix: '/api/v1/livraisons' });
  await app.register(paiementRoutes, { prefix: '/api/v1/paiements' });
  await app.register(villeRoutes, { prefix: '/api/v1/villes' });
  await app.register(zoneRoutes, { prefix: '/api/v1/zones' });
  await app.register(promotionRoutes, { prefix: '/api/v1/promotions' });
  await app.register(analyticsRoutes, { prefix: '/api/v1/analytics' });
};

/**
 * Register error handlers
 */
const registerErrorHandlers = (): void => {
  app.setErrorHandler(errorHandler);
  app.setNotFoundHandler(notFoundHandler);
};

/**
 * Initialize the application
 */
export const initializeApp = async (): Promise<typeof app> => {
  await registerPlugins();
  await registerRoutes();
  registerErrorHandlers();

  return app;
};
