import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { checkDatabaseConnection } from '../../config/database.js';

export async function healthRoutes(fastify: FastifyInstance, _opts: FastifyPluginOptions) {
  fastify.get('/', async (_request, reply) => {
    const isDbConnected = await checkDatabaseConnection();

    return reply.status(200).send({
      success: true,
      message: 'Sahabat Muslim API is running',
      database: isDbConnected ? 'connected' : 'disconnected',
    });
  });
}
