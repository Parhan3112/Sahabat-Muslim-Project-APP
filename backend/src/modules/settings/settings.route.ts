import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { getUserSettingsHandler, updateUserSettingsHandler } from './settings.controller.js';

export async function settingsRoutes(fastify: FastifyInstance, _opts: FastifyPluginOptions) {
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.get('/', getUserSettingsHandler);
  fastify.put('/', updateUserSettingsHandler);
}
