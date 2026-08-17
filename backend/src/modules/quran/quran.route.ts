import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { getAllSurahsHandler, getSurahDetailHandler } from './quran.controller.js';

export async function quranRoutes(fastify: FastifyInstance, _opts: FastifyPluginOptions) {
  fastify.get('/surah', getAllSurahsHandler);
  fastify.get('/surah/:number', getSurahDetailHandler);
}
