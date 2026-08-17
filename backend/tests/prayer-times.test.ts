import { describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';

describe('Prayer Times API Module', () => {
  const app = buildApp();

  it('GET /api/v1/prayer-times/today should return today prayer times for given coordinates', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/prayer-times/today?latitude=-6.200000&longitude=106.816666',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('timings');
    expect(body.data.timings).toHaveProperty('subuh');
    expect(body.data.timings).toHaveProperty('dzuhur');
    expect(body.data.timings).toHaveProperty('ashar');
    expect(body.data.timings).toHaveProperty('maghrib');
    expect(body.data.timings).toHaveProperty('isya');
  });

  it('GET /api/v1/prayer-times/monthly should return monthly prayer schedule', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/prayer-times/monthly?latitude=-6.200000&longitude=106.816666&month=8&year=2026',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(27);
  });
});
