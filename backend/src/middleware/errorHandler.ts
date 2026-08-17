import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

export function globalErrorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  request.log.error(error);

  if (error instanceof ZodError) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: error.errors,
      },
    });
  }

  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 ? 'Internal Server Error' : error.message;

  return reply.status(statusCode).send({
    success: false,
    error: {
      code: error.code || 'INTERNAL_SERVER_ERROR',
      message: message,
    },
  });
}
