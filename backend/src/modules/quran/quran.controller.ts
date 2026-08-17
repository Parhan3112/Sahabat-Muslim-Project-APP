import { FastifyReply, FastifyRequest } from 'fastify';
import { getAllSurahs, getSurahDetail } from './quran.service.js';

export async function getAllSurahsHandler(_request: FastifyRequest, reply: FastifyReply) {
  const surahs = await getAllSurahs();
  return reply.status(200).send({
    success: true,
    message: 'Daftar Surah Al-Qur\'an berhasil diambil',
    data: surahs,
  });
}

export async function getSurahDetailHandler(
  request: FastifyRequest<{ Params: { number: string } }>,
  reply: FastifyReply
) {
  const surahNumber = parseInt(request.params.number, 10);
  if (isNaN(surahNumber)) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'INVALID_PARAMETER',
        message: 'Parameter nomor surah harus berupa angka',
      },
    });
  }

  const surah = await getSurahDetail(surahNumber);
  return reply.status(200).send({
    success: true,
    message: `Detail Surah nomor ${surahNumber} berhasil diambil`,
    data: surah,
  });
}
