/**
 * Error Handler Middleware
 * ===========================================
 * Presentation Layer - Middleware
 */

import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { logger } from '../../shared/utils/logger.util.js';

export const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
): void => {
  // Log error
  logger.error(error.message, {
    url: request.url,
    method: request.method,
    stack: error.stack,
  });

  // Zod validation errors
  if (error instanceof ZodError) {
    reply.status(400).send({
      success: false,
      statusCode: 400,
      message: 'Validation failed',
      errors: error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      })),
    });
    return;
  }

  // Custom application errors
  const statusCode = error.statusCode || 500;

  reply.status(statusCode).send({
    success: false,
    statusCode,
    message: error.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
  });
};
