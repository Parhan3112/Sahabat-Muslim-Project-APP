import { describe, it, expect, beforeAll } from 'vitest';
import { buildApp } from '../src/app.js';

describe('Mosques and Dzikir Modules API Tests', () => {
  let app: ReturnType<typeof buildApp>;

  beforeAll(async () => {
    app = buildApp();
    await app.ready();
  });

  describe('GET /api/v1/mosques/nearby', () => {
    it('should return nearby mosques with calculated distance and google maps URL', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/mosques/nearby?lat=-6.2088&lng=106.8456',
      });

      expect(response.statusCode).toBe(200);
      const json = response.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.mosques)).toBe(true);
      expect(json.mosques.length).toBeGreaterThan(0);

      const firstMosque = json.mosques[0];
      expect(firstMosque).toHaveProperty('name');
      expect(firstMosque).toHaveProperty('distanceMeter');
      expect(firstMosque).toHaveProperty('googleMapsUrl');
      expect(firstMosque.googleMapsUrl).toContain('google.com/maps/dir');
    });
  });

  describe('GET /api/v1/dzikir/:category', () => {
    it('should return dzikir pagi list', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/dzikir/pagi',
      });

      expect(response.statusCode).toBe(200);
      const json = response.json();
      expect(json.success).toBe(true);
      expect(json.category).toBe('pagi');
      expect(Array.isArray(json.items)).toBe(true);
      expect(json.items.length).toBeGreaterThan(0);

      const firstItem = json.items[0];
      expect(firstItem).toHaveProperty('title');
      expect(firstItem).toHaveProperty('textArabic');
      expect(firstItem).toHaveProperty('targetCount');
    });

    it('should return dzikir petang list', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/dzikir/petang',
      });

      expect(response.statusCode).toBe(200);
      const json = response.json();
      expect(json.category).toBe('petang');
      expect(json.items.length).toBeGreaterThan(0);
    });

    it('should return doa harian list', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/dzikir/doa-harian',
      });

      expect(response.statusCode).toBe(200);
      const json = response.json();
      expect(json.category).toBe('doa-harian');
      expect(json.items.length).toBeGreaterThan(0);
    });
  });
});
