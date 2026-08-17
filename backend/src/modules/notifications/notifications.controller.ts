import { FastifyReply, FastifyRequest } from 'fastify';
import { updateNotificationSettingsSchema } from './notifications.schema.js';
import { getNotificationSettings, updateNotificationSettings } from './notifications.service.js';

export async function getNotificationSettingsHandler(request: FastifyRequest, reply: FastifyReply) {
  const settings = await getNotificationSettings(request.user.id);
  return reply.status(200).send({
    success: true,
    message: 'Pengaturan notifikasi berhasil diambil',
    data: settings,
  });
}

export async function updateNotificationSettingsHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = updateNotificationSettingsSchema.parse(request.body);
  const settings = await updateNotificationSettings(request.user.id, body);

  return reply.status(200).send({
    success: true,
    message: 'Pengaturan notifikasi berhasil diperbarui',
    data: settings,
  });
}
