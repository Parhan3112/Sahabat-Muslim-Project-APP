import { FastifyReply, FastifyRequest } from 'fastify';
import { updateReadingProgressSchema } from './reading-progress.schema.js';
import { getUserReadingProgress, updateUserReadingProgress } from './reading-progress.service.js';

export async function getUserReadingProgressHandler(request: FastifyRequest, reply: FastifyReply) {
  const progress = await getUserReadingProgress(request.user.id);
  return reply.status(200).send({
    success: true,
    message: 'Progress membaca Al-Qur\'an berhasil diambil',
    data: progress,
  });
}

export async function updateUserReadingProgressHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = updateReadingProgressSchema.parse(request.body);
  const progress = await updateUserReadingProgress(request.user.id, body);

  return reply.status(200).send({
    success: true,
    message: 'Progress membaca Al-Qur\'an berhasil diperbarui',
    data: progress,
  });
}
