import { FastifyReply, FastifyRequest } from 'fastify';
import { updateUserSettingsSchema } from './settings.schema.js';
import { getUserSettings, updateUserSettings } from './settings.service.js';

export async function getUserSettingsHandler(request: FastifyRequest, reply: FastifyReply) {
  const settings = await getUserSettings(request.user.id);
  return reply.status(200).send({
    success: true,
    message: 'Pengaturan pengguna berhasil diambil',
    data: settings,
  });
}

export async function updateUserSettingsHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = updateUserSettingsSchema.parse(request.body);
  const settings = await updateUserSettings(request.user.id, body);

  return reply.status(200).send({
    success: true,
    message: 'Pengaturan pengguna berhasil diperbarui',
    data: settings,
  });
}
