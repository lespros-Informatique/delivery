/**
 * Not Found Handler Middleware
 * ===========================================
 * Presentation Layer - Middleware
 */

import { FastifyReply, FastifyRequest } from 'fastify';

export const notFoundHandler = (
  request: FastifyRequest,
  reply: FastifyReply
): void => {
  reply.status(404).send({
    success: false,
    statusCode: 404,
    message: `Route ${request.method} ${request.url} not found`,
  });
};
