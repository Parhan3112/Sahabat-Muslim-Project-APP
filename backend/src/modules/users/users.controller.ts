import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../config/database.js';

export async function getMeHandler(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return reply.status(404).send({
      success: false,
      error: {
        code: 'USER_NOT_FOUND',
        message: 'Pengguna tidak ditemukan',
      },
    });
  }

  return reply.status(200).send({
    success: true,
    message: 'Profil pengguna berhasil diambil',
    data: user,
  });
}
