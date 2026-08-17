import { FastifyInstance } from 'fastify';
import { getNearbyMosquesHandler } from './mosques.controller.js';

export async function mosquesRoutes(app: FastifyInstance) {
  app.get('/nearby', getNearbyMosquesHandler);
}
