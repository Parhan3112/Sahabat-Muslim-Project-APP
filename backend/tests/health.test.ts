import { describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';

describe('GET /api/v1/health', () => {
  it('should return 200 OK and health status JSON', async () => {
    const app = buildApp();

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/health',
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.payload);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Sahabat Muslim API is running');
    expect(body).toHaveProperty('database');

    await app.close();
  });
});
