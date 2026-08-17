import { FastifyReply, FastifyRequest } from 'fastify';
import { getDzikirByCategory } from './dzikir.service.js';

export async function getDzikirHandler(request: FastifyRequest, reply: FastifyReply) {
  const params = request.params as any;
  const category = params.category || 'pagi';
  const list = await getDzikirByCategory(category);

  return reply.send({
    success: true,
    category,
    total: list.length,
    items: list,
  });
}
