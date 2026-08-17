import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { getMonthlyPrayerTimesHandler, getTodayPrayerTimesHandler } from './prayer-times.controller.js';

export async function prayerTimesRoutes(fastify: FastifyInstance, _opts: FastifyPluginOptions) {
  fastify.get('/today', getTodayPrayerTimesHandler);
  fastify.get('/monthly', getMonthlyPrayerTimesHandler);
}
