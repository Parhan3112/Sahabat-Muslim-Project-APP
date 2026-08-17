import { z } from 'zod';

export const updateReadingProgressSchema = z.object({
  lastSurahNumber: z.number().int().min(1).max(114, 'Nomor Surah harus 1-114'),
  lastVerseNumber: z.number().int().min(1, 'Nomor Ayat minimal 1'),
  lastSurahNameLatin: z.string().min(1, 'Nama Surah wajib diisi'),
  currentSurahTotalVerses: z.number().int().min(1).optional().default(7),
  dailyVerseTarget: z.number().int().min(1).max(1000).optional().default(30),
  versesReadIncrement: z.number().int().min(0).optional().default(0),
});

export type UpdateReadingProgressInput = z.infer<typeof updateReadingProgressSchema>;
