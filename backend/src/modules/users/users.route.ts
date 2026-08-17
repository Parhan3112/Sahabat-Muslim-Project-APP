import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { getMeHandler } from './users.controller.js';

export async function usersRoutes(fastify: FastifyInstance, _opts: FastifyPluginOptions) {
  fastify.get(
    '/me',
    {
      onRequest: [fastify.authenticate],
    },
    getMeHandler
  );
}
