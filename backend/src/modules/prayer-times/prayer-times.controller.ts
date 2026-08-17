import { FastifyReply, FastifyRequest } from 'fastify';
import { monthlyPrayerQuerySchema, todayPrayerQuerySchema } from './prayer-times.schema.js';
import { getMonthlyPrayerTimes, getTodayPrayerTimes } from './prayer-times.service.js';

export async function getTodayPrayerTimesHandler(request: FastifyRequest, reply: FastifyReply) {
  const query = todayPrayerQuerySchema.parse(request.query);
  const data = await getTodayPrayerTimes(query.latitude, query.longitude);

  return reply.status(200).send({
    success: true,
    message: 'Jadwal sholat hari ini berhasil diambil',
    data,
  });
}

export async function getMonthlyPrayerTimesHandler(request: FastifyRequest, reply: FastifyReply) {
  const query = monthlyPrayerQuerySchema.parse(request.query);
  const data = await getMonthlyPrayerTimes(query.latitude, query.longitude, query.month, query.year);

  return reply.status(200).send({
    success: true,
    message: `Jadwal sholat bulanan (${query.month}/${query.year}) berhasil diambil`,
    data,
  });
}
