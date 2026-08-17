import { beforeAll, describe, expect, it, vi } from 'vitest';
import { buildApp } from '../src/app.js';

vi.mock('../src/config/database.js', async () => {
  const bookmarksStore: any[] = [];
  let readingProgressStore: any = null;
  let notificationStore: any = null;
  let userSettingsStore: any = null;

  return {
    prisma: {
      bookmark: {
        findMany: vi.fn(async () => bookmarksStore),
        findUnique: vi.fn(async ({ where }: any) => {
          if (where.userId_surahNumber_verseNumber) {
            const { userId, surahNumber, verseNumber } = where.userId_surahNumber_verseNumber;
            return (
              bookmarksStore.find(
                (b) => b.userId === userId && b.surahNumber === surahNumber && b.verseNumber === verseNumber
              ) || null
            );
          }
          return null;
        }),
        findFirst: vi.fn(async ({ where }: any) => {
          return bookmarksStore.find((b) => b.id === where.id && b.userId === where.userId) || null;
        }),
        create: vi.fn(async ({ data }: any) => {
          const newBookmark = {
            id: `bm-${Date.now()}`,
            ...data,
            createdAt: new Date(),
          };
          bookmarksStore.push(newBookmark);
          return newBookmark;
        }),
        delete: vi.fn(async ({ where }: any) => {
          const index = bookmarksStore.findIndex((b) => b.id === where.id);
          if (index !== -1) bookmarksStore.splice(index, 1);
          return { id: where.id };
        }),
      },
      readingProgress: {
        findUnique: vi.fn(async () => readingProgressStore),
        create: vi.fn(async ({ data }: any) => {
          readingProgressStore = { id: 'rp-123', ...data, updatedAt: new Date() };
          return readingProgressStore;
        }),
        upsert: vi.fn(async ({ create, update }: any) => {
          if (!readingProgressStore) {
            readingProgressStore = { id: 'rp-123', ...create, updatedAt: new Date() };
          } else {
            readingProgressStore = { ...readingProgressStore, ...update, updatedAt: new Date() };
          }
          return readingProgressStore;
        }),
      },
      notificationSetting: {
        findUnique: vi.fn(async () => notificationStore),
        create: vi.fn(async ({ data }: any) => {
          notificationStore = { id: 'ns-123', ...data, updatedAt: new Date() };
          return notificationStore;
        }),
        upsert: vi.fn(async ({ create, update }: any) => {
          if (!notificationStore) {
            notificationStore = { id: 'ns-123', ...create, updatedAt: new Date() };
          } else {
            notificationStore = { ...notificationStore, ...update, updatedAt: new Date() };
          }
          return notificationStore;
        }),
      },
      userSettings: {
        findUnique: vi.fn(async () => userSettingsStore),
        create: vi.fn(async ({ data }: any) => {
          userSettingsStore = { id: 'us-123', ...data, updatedAt: new Date() };
          return userSettingsStore;
        }),
        upsert: vi.fn(async ({ create, update }: any) => {
          if (!userSettingsStore) {
            userSettingsStore = { id: 'us-123', ...create, updatedAt: new Date() };
          } else {
            userSettingsStore = { ...userSettingsStore, ...update, updatedAt: new Date() };
          }
          return userSettingsStore;
        }),
      },
    },
    checkDatabaseConnection: vi.fn(async () => true),
  };
});

describe('User Features API Modules (Bookmarks, Reading Progress, Notifications, Settings)', () => {
  const app = buildApp();
  let authHeaders: { authorization: string };

  beforeAll(async () => {
    await app.ready();
    const token = app.jwt.sign({ id: 'user-123', email: 'test@example.com', name: 'Test User' });
    authHeaders = { authorization: `Bearer ${token}` };
  });

  describe('Bookmarks Module', () => {
    let createdBookmarkId: string;

    it('POST /api/v1/bookmarks should create a new bookmark', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/bookmarks',
        headers: authHeaders,
        payload: {
          surahNumber: 2,
          verseNumber: 255,
          surahNameLatin: 'Al-Baqarah',
          note: 'Ayat Kursi',
        },
      });

      expect(res.statusCode).toBe(201);
      const body = JSON.parse(res.payload);
      expect(body.success).toBe(true);
      expect(body.data.surahNumber).toBe(2);
      expect(body.data.verseNumber).toBe(255);
      createdBookmarkId = body.data.id;
    });

    it('GET /api/v1/bookmarks should return list of user bookmarks', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/v1/bookmarks',
        headers: authHeaders,
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.data.length).toBe(1);
    });

    it('DELETE /api/v1/bookmarks/:id should delete bookmark', async () => {
      const res = await app.inject({
        method: 'DELETE',
        url: `/api/v1/bookmarks/${createdBookmarkId}`,
        headers: authHeaders,
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.success).toBe(true);
    });
  });

  describe('Reading Progress Module', () => {
    it('GET /api/v1/reading-progress should return reading progress and khatam stats', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/v1/reading-progress',
        headers: authHeaders,
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.success).toBe(true);
      expect(body.data).toHaveProperty('khatamStats');
      expect(body.data.lastSurahNameLatin).toBe('Al-Fatihah');
    });

    it('PUT /api/v1/reading-progress should update last read verse and calculate progress', async () => {
      const res = await app.inject({
        method: 'PUT',
        url: '/api/v1/reading-progress',
        headers: authHeaders,
        payload: {
          lastSurahNumber: 36,
          lastVerseNumber: 12,
          lastSurahNameLatin: 'Yasin',
          versesReadIncrement: 50,
          targetKhatamDays: 30,
        },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.success).toBe(true);
      expect(body.data.lastSurahNameLatin).toBe('Yasin');
      expect(body.data.totalVersesRead).toBe(50);
      expect(body.data.khatamStats.percentageCompleted).toBeGreaterThan(0);
    });
  });

  describe('Notifications Module', () => {
    it('GET /api/v1/notifications/settings should return notification settings', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/v1/notifications/settings',
        headers: authHeaders,
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.success).toBe(true);
      expect(body.data.enableSubuh).toBe(true);
    });

    it('PUT /api/v1/notifications/settings should update notification options', async () => {
      const res = await app.inject({
        method: 'PUT',
        url: '/api/v1/notifications/settings',
        headers: authHeaders,
        payload: {
          enableSubuh: true,
          enableIsya: false,
          reminderTime: '21:30',
        },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.success).toBe(true);
      expect(body.data.enableIsya).toBe(false);
      expect(body.data.reminderTime).toBe('21:30');
    });
  });

  describe('UserSettings Module', () => {
    it('GET /api/v1/settings should return user settings', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/v1/settings',
        headers: authHeaders,
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.success).toBe(true);
      expect(body.data.theme).toBe('dark');
    });

    it('PUT /api/v1/settings should update theme and font preferences', async () => {
      const res = await app.inject({
        method: 'PUT',
        url: '/api/v1/settings',
        headers: authHeaders,
        payload: {
          arabicFontSize: 32,
          theme: 'green',
          audioReciter: 'sudais',
        },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.success).toBe(true);
      expect(body.data.arabicFontSize).toBe(32);
      expect(body.data.theme).toBe('green');
      expect(body.data.audioReciter).toBe('sudais');
    });
  });
});
