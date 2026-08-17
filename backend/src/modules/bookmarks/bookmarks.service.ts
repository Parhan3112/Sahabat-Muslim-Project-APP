import { prisma } from '../../config/database.js';
import { CreateBookmarkInput } from './bookmarks.schema.js';

export async function getUserBookmarks(userId: string) {
  return prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createBookmark(userId: string, input: CreateBookmarkInput) {
  const existing = await prisma.bookmark.findUnique({
    where: {
      userId_surahNumber_verseNumber: {
        userId,
        surahNumber: input.surahNumber,
        verseNumber: input.verseNumber,
      },
    },
  });

  if (existing) {
    const error: any = new Error('Ayat ini sudah ditandai di bookmark Anda');
    error.statusCode = 400;
    error.code = 'BOOKMARK_ALREADY_EXISTS';
    throw error;
  }

  return prisma.bookmark.create({
    data: {
      userId,
      surahNumber: input.surahNumber,
      verseNumber: input.verseNumber,
      surahNameLatin: input.surahNameLatin,
      note: input.note || null,
    },
  });
}

export async function deleteBookmark(userId: string, bookmarkId: string) {
  const bookmark = await prisma.bookmark.findFirst({
    where: {
      id: bookmarkId,
      userId,
    },
  });

  if (!bookmark) {
    const error: any = new Error('Bookmark tidak ditemukan');
    error.statusCode = 404;
    error.code = 'BOOKMARK_NOT_FOUND';
    throw error;
  }

  await prisma.bookmark.delete({
    where: { id: bookmarkId },
  });

  return { id: bookmarkId };
}
