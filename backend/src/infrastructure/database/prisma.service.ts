/**
 * Prisma Service - Database Connection
 * ===========================================
 * Infrastructure Layer - Database
 */

import { PrismaClient } from '@prisma/client';
import { logger } from '../../shared/utils/logger.util.js';

/**
 * Prisma Client singleton instance
 * Avoids creating multiple connections in development
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'warn' },
    ],
  });

// Connect on import
prisma.$connect()
  .then(() => {
    logger.info('Database connected successfully');
  })
  .catch((err) => {
    logger.error('Failed to connect to database', err);
  });

// Log queries in development
if (process.env.NODE_ENV !== 'production') {
  prisma.$on('query' as never, (e: never) => {
    logger.debug('Query: ' + (e as { query: string }).query);
  });
}

// Save to global in development to avoid reconnecting
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Graceful shutdown
 */
export const disconnectPrisma = async (): Promise<void> => {
  await prisma.$disconnect();
  logger.info('Database disconnected');
};
