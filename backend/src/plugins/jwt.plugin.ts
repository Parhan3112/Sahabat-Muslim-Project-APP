import fastifyJwt from '@fastify/jwt';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { env } from '../config/env.js';

export interface UserPayload {
  id: string;
  email: string;
  name: string;
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: UserPayload;
    user: UserPayload;
  }
}

export default fp(async (fastify: FastifyInstance) => {
  fastify.register(fastifyJwt, {
    secret: env.JWT_SECRET,
  });

  fastify.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.status(401).send({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Token tidak valid atau telah kadaluwarsa',
          },
        });
      }
    }
  );
});
