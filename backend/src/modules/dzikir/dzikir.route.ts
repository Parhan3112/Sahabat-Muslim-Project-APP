import { FastifyInstance } from 'fastify';
import { getDzikirHandler } from './dzikir.controller.js';

export async function dzikirRoutes(app: FastifyInstance) {
  app.get('/', getDzikirHandler);
  app.get('/:category', getDzikirHandler);
}
