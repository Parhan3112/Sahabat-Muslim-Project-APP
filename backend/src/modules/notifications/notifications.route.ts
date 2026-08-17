import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { getNotificationSettingsHandler, updateNotificationSettingsHandler } from './notifications.controller.js';

export async function notificationsRoutes(fastify: FastifyInstance, _opts: FastifyPluginOptions) {
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.get('/settings', getNotificationSettingsHandler);
  fastify.put('/settings', updateNotificationSettingsHandler);
}
