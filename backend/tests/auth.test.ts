import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildApp } from '../src/app.js';

vi.mock('../src/config/database.js', async () => {
  const usersStore: any[] = [];
  return {
    prisma: {
      user: {
        findUnique: vi.fn(async ({ where }: { where: { email?: string; id?: string } }) => {
          if (where.email) {
            return usersStore.find((u) => u.email === where.email) || null;
          }
          if (where.id) {
            const found = usersStore.find((u) => u.id === where.id);
            if (!found) return null;
            const { password: _, ...withoutPass } = found;
            return withoutPass;
          }
          return null;
        }),
        create: vi.fn(async ({ data }: { data: any }) => {
          const newUser = {
            id: 'test-uuid-1234',
            email: data.email,
            name: data.name,
            password: data.password,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          usersStore.push(newUser);
          const { password: _, ...userWithoutPassword } = newUser;
          return userWithoutPassword;
        }),
      },
    },
    checkDatabaseConnection: vi.fn(async () => true),
  };
});

describe('Auth & Users API Module', () => {
  const app = buildApp();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
          email: 'user1@example.com',
          password: 'password123',
          name: 'Ahmad User',
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.payload);
      expect(body.success).toBe(true);
      expect(body.message).toBe('Registrasi berhasil');
      expect(body.data).toHaveProperty('token');
      expect(body.data.user.email).toBe('user1@example.com');
      expect(body.data.user).not.toHaveProperty('password');
    });

    it('should return error when registering with duplicate email', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: {
          email: 'user1@example.com',
          password: 'password123',
          name: 'Ahmad User',
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.payload);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('EMAIL_ALREADY_EXISTS');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: {
          email: 'user1@example.com',
          password: 'password123',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(body.success).toBe(true);
      expect(body.message).toBe('Login berhasil');
      expect(body.data).toHaveProperty('token');
    });

    it('should fail login with wrong password', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: {
          email: 'user1@example.com',
          password: 'wrongpassword',
        },
      });

      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.payload);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('INVALID_CREDENTIALS');
    });
  });

  describe('GET /api/v1/users/me', () => {
    it('should return 401 Unauthorized without token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/users/me',
      });

      expect(response.statusCode).toBe(401);
    });

    it('should return user profile with valid JWT token', async () => {
      // First login to get a valid token
      const loginRes = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: {
          email: 'user1@example.com',
          password: 'password123',
        },
      });

      const token = JSON.parse(loginRes.payload).data.token;

      const profileRes = await app.inject({
        method: 'GET',
        url: '/api/v1/users/me',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(profileRes.statusCode).toBe(200);
      const body = JSON.parse(profileRes.payload);
      expect(body.success).toBe(true);
      expect(body.data.email).toBe('user1@example.com');
      expect(body.data.name).toBe('Ahmad User');
    });
  });
});
