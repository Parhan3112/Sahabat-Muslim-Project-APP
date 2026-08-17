import { prisma } from '../../config/database.js';
import { UpdateReadingProgressInput } from './reading-progress.schema.js';

const TOTAL_QURAN_VERSES = 6236;
const TOTAL_QURAN_SURAHS = 114;

export async function getUserReadingProgress(userId: string) {
  let progress = await prisma.readingProgress.findUnique({
    where: { userId },
  });

  if (!progress) {
    progress = await prisma.readingProgress.create({
      data: {
        userId,
        lastSurahNumber: 1,
        lastVerseNumber: 1,
        lastSurahNameLatin: 'Al-Fatihah',
        currentSurahTotalVerses: 7,
        dailyVerseTarget: 30,
        totalVersesRead: 0,
      },
    });
  }

  const remainingTotalVerses = Math.max(0, TOTAL_QURAN_VERSES - progress.totalVersesRead);
  const remainingVersesInCurrentSurah = Math.max(0, progress.currentSurahTotalVerses - progress.lastVerseNumber);
  const remainingSurahsToKhatam = Math.max(0, TOTAL_QURAN_SURAHS - progress.lastSurahNumber);

  const dailyTarget = progress.dailyVerseTarget || 30;
  const estimatedDaysToKhatam = Math.ceil((remainingTotalVerses || TOTAL_QURAN_VERSES) / dailyTarget);
  const estimatedMonthsToKhatam = Math.round((estimatedDaysToKhatam / 30) * 10) / 10;
  const percentageCompleted = Math.min(100, Math.round((progress.totalVersesRead / TOTAL_QURAN_VERSES) * 10000) / 100);

  return {
    ...progress,
    khatamStats: {
      totalQuranVerses: TOTAL_QURAN_VERSES,
      totalQuranSurahs: TOTAL_QURAN_SURAHS,
      percentageCompleted,
      remainingTotalVerses,
      remainingVersesInCurrentSurah,
      remainingSurahsToKhatam,
      dailyVerseTarget: dailyTarget,
      estimatedDaysToKhatam,
      estimatedMonthsToKhatam,
    },
  };
}

export async function updateUserReadingProgress(userId: string, input: UpdateReadingProgressInput) {
  const current = await prisma.readingProgress.findUnique({
    where: { userId },
  });

  const currentTotal = current ? current.totalVersesRead : 0;
  const newTotalRead = currentTotal + (input.versesReadIncrement || 0);

  const updated = await prisma.readingProgress.upsert({
    where: { userId },
    update: {
      lastSurahNumber: input.lastSurahNumber,
      lastVerseNumber: input.lastVerseNumber,
      lastSurahNameLatin: input.lastSurahNameLatin,
      currentSurahTotalVerses: input.currentSurahTotalVerses || (current ? current.currentSurahTotalVerses : 7),
      dailyVerseTarget: input.dailyVerseTarget || (current ? current.dailyVerseTarget : 30),
      totalVersesRead: newTotalRead,
    },
    create: {
      userId,
      lastSurahNumber: input.lastSurahNumber,
      lastVerseNumber: input.lastVerseNumber,
      lastSurahNameLatin: input.lastSurahNameLatin,
      currentSurahTotalVerses: input.currentSurahTotalVerses || 7,
      dailyVerseTarget: input.dailyVerseTarget || 30,
      totalVersesRead: input.versesReadIncrement || 0,
    },
  });

  const remainingTotalVerses = Math.max(0, TOTAL_QURAN_VERSES - updated.totalVersesRead);
  const remainingVersesInCurrentSurah = Math.max(0, updated.currentSurahTotalVerses - updated.lastVerseNumber);
  const remainingSurahsToKhatam = Math.max(0, TOTAL_QURAN_SURAHS - updated.lastSurahNumber);

  const dailyTarget = updated.dailyVerseTarget || 30;
  const estimatedDaysToKhatam = Math.ceil((remainingTotalVerses || TOTAL_QURAN_VERSES) / dailyTarget);
  const estimatedMonthsToKhatam = Math.round((estimatedDaysToKhatam / 30) * 10) / 10;
  const percentageCompleted = Math.min(100, Math.round((updated.totalVersesRead / TOTAL_QURAN_VERSES) * 10000) / 100);

  return {
    ...updated,
    khatamStats: {
      totalQuranVerses: TOTAL_QURAN_VERSES,
      totalQuranSurahs: TOTAL_QURAN_SURAHS,
      percentageCompleted,
      remainingTotalVerses,
      remainingVersesInCurrentSurah,
      remainingSurahsToKhatam,
      dailyVerseTarget: dailyTarget,
      estimatedDaysToKhatam,
      estimatedMonthsToKhatam,
    },
  };
}
