import { FastifyReply, FastifyRequest } from 'fastify';
import { findNearbyMosques } from './mosques.service.js';

export async function getNearbyMosquesHandler(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query as any;
  const lat = parseFloat(query.lat) || -6.2088;
  const lng = parseFloat(query.lng) || 106.8456;
  const radius = parseInt(query.radius || '5000', 10);

  const mosques = await findNearbyMosques(lat, lng, radius);
  return reply.send({
    success: true,
    userLocation: { lat, lng },
    totalFound: mosques.length,
    mosques,
  });
}
