import { z } from 'zod';

export const createBookmarkSchema = z.object({
  surahNumber: z.number().int().min(1).max(114, 'Nomor Surah harus 1-114'),
  verseNumber: z.number().int().min(1, 'Nomor Ayat minimal 1'),
  surahNameLatin: z.string().min(1, 'Nama Surah wajib diisi'),
  note: z.string().optional(),
});

export type CreateBookmarkInput = z.infer<typeof createBookmarkSchema>;
