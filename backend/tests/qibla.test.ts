import { describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';

describe('Qibla API Module', () => {
  const app = buildApp();

  it('GET /api/v1/qibla should return calculated qibla direction and distance', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/qibla?latitude=-6.200000&longitude=106.816666',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('directionDegree');
    expect(body.data).toHaveProperty('distanceKm');
    expect(body.data.directionDegree).toBeGreaterThan(290);
    expect(body.data.directionDegree).toBeLessThan(300);
  });

  it('GET /api/v1/qibla should return 400 Bad Request for invalid latitude', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/qibla?latitude=999&longitude=106.816666',
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.payload);
    expect(body.success).toBe(false);
  });
});
