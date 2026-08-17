import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { getQiblaHandler } from './qibla.controller.js';

export async function qiblaRoutes(fastify: FastifyInstance, _opts: FastifyPluginOptions) {
  fastify.get('/', getQiblaHandler);
}
