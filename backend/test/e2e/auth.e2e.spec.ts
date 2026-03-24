import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createTestApp, signToken } from '../helpers/create-test-app';
import { mockPrisma, resetMocks } from '../helpers/mock-prisma';
import { ADMIN_USER } from '../helpers/fixtures';
import { UserRole } from '../../src/domain/common/types/UserRole';

describe('Auth E2E', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeAll(async () => {
    ({ app, jwtService } = await createTestApp());
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    resetMocks();
  });

  // ── POST /api/auth/login ─────────────────────────────────────────────────

  describe('POST /api/auth/login', () => {
    it('returns 200 with accessToken for valid credentials', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(ADMIN_USER);

      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'admin@lab.com', password: 'TestPass123!' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body.user.email).toBe('admin@lab.com');
      expect(res.body.user.role).toBe('ADMIN');
    });

    it('returns 401 for inactive user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...ADMIN_USER,
        isActive: false,
      });

      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'admin@lab.com', password: 'TestPass123!' });

      expect(res.status).toBe(401);
    });

    it('returns 401 for unknown user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'ghost@lab.com', password: 'TestPass123!' });

      expect(res.status).toBe(401);
    });

    it('returns 400 for missing body fields', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'not-an-email' }); // missing password, invalid email

      expect(res.status).toBe(400);
    });
  });

  // ── GET /api/auth/me ──────────────────────────────────────────────────────

  describe('GET /api/auth/me', () => {
    it('returns current user when authenticated', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(ADMIN_USER);

      const token = signToken(jwtService, {
        sub: ADMIN_USER.id,
        email: ADMIN_USER.email,
        role: UserRole.ADMIN,
      });

      const res = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe('admin@lab.com');
    });

    it('returns 401 without token', async () => {
      const res = await request(app.getHttpServer()).get('/api/auth/me');
      expect(res.status).toBe(401);
    });

    it('returns 401 with invalid token', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid.token.here');
      expect(res.status).toBe(401);
    });
  });

  // ── Swagger / OpenAPI reachable ──────────────────────────────────────────

  describe('GET /api/docs', () => {
    it('Swagger UI is reachable', async () => {
      const res = await request(app.getHttpServer()).get('/api/docs');
      // Swagger setup returns 301 redirect to /docs/ or 200 HTML
      expect([200, 301, 302]).toContain(res.status);
    });
  });
});
