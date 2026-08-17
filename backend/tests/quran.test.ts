import { describe, expect, it, vi } from 'vitest';
import { buildApp } from '../src/app.js';

describe('Quran API Module', () => {
  const app = buildApp();

  it('GET /api/v1/quran/surah should return list of surahs', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/quran/surah',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0]).toHaveProperty('number');
    expect(body.data[0]).toHaveProperty('nameArabic');
    expect(body.data[0]).toHaveProperty('nameLatin');
  });

  it('GET /api/v1/quran/surah/1 should return detail of Surah Al-Fatihah', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/quran/surah/1',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.success).toBe(true);
    expect(body.data.number).toBe(1);
    expect(body.data.nameLatin).toBe('Al-Fatihah');
    expect(Array.isArray(body.data.verses)).toBe(true);
    expect(body.data.verses.length).toBe(7);
  });

  it('GET /api/v1/quran/surah/999 should return 400 Bad Request for invalid surah number', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/quran/surah/999',
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.payload);
    expect(body.success).toBe(false);
  });
});
