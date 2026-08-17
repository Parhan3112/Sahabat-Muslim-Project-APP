import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { loginHandler, registerHandler } from './auth.controller.js';

export async function authRoutes(fastify: FastifyInstance, _opts: FastifyPluginOptions) {
  fastify.post('/register', registerHandler);
  fastify.post('/login', loginHandler);
}
