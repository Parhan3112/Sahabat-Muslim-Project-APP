import { FastifyReply, FastifyRequest } from 'fastify';
import { qiblaQuerySchema } from './qibla.schema.js';
import { getQiblaDirection } from './qibla.service.js';

export async function getQiblaHandler(request: FastifyRequest, reply: FastifyReply) {
  const query = qiblaQuerySchema.parse(request.query);
  const data = await getQiblaDirection(query.latitude, query.longitude);

  return reply.status(200).send({
    success: true,
    message: 'Arah kiblat berhasil dihitung',
    data,
  });
}
