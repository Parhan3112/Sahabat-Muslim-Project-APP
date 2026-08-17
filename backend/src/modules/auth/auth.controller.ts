import { FastifyReply, FastifyRequest } from 'fastify';
import { loginSchema, registerSchema } from './auth.schema.js';
import { loginUser, registerUser } from './auth.service.js';

export async function registerHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = registerSchema.parse(request.body);
  const user = await registerUser(body);

  const token = request.server.jwt.sign({
    id: user.id,
    email: user.email,
    name: user.name,
  });

  return reply.status(201).send({
    success: true,
    message: 'Registrasi berhasil',
    data: {
      token,
      user,
    },
  });
}

export async function loginHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = loginSchema.parse(request.body);
  const user = await loginUser(body);

  const token = request.server.jwt.sign({
    id: user.id,
    email: user.email,
    name: user.name,
  });

  return reply.status(200).send({
    success: true,
    message: 'Login berhasil',
    data: {
      token,
      user,
    },
  });
}
