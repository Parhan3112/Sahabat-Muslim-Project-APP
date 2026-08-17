import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { getUserReadingProgressHandler, updateUserReadingProgressHandler } from './reading-progress.controller.js';

export async function readingProgressRoutes(fastify: FastifyInstance, _opts: FastifyPluginOptions) {
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.get('/', getUserReadingProgressHandler);
  fastify.put('/', updateUserReadingProgressHandler);
}
