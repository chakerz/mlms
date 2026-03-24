import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createTestApp, signToken } from '../helpers/create-test-app';
import { mockPrisma, resetMocks } from '../helpers/mock-prisma';
import {
  PHYSICIAN_USER,
  ADMIN_USER,
  ORDER_ROW,
  RESULT_ROW,
  REPORT_ROW,
} from '../helpers/fixtures';
import { UserRole } from '../../src/domain/common/types/UserRole';

describe('Report E2E', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let physicianToken: string;
  let adminToken: string;

  beforeAll(async () => {
    ({ app, jwtService } = await createTestApp());
    physicianToken = signToken(jwtService, {
      sub: PHYSICIAN_USER.id,
      email: PHYSICIAN_USER.email,
      role: UserRole.PHYSICIAN,
    });
    adminToken = signToken(jwtService, {
      sub: ADMIN_USER.id,
      email: ADMIN_USER.email,
      role: UserRole.ADMIN,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    resetMocks();
  });

  // ── POST /api/reports/generate ───────────────────────────────────────────

  describe('POST /api/reports/generate', () => {
    it('generates a DRAFT report when order has results', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(ORDER_ROW);
      mockPrisma.result.findMany.mockResolvedValue([RESULT_ROW]);
      mockPrisma.report.create.mockResolvedValue(REPORT_ROW);

      const res = await request(app.getHttpServer())
        .post('/api/reports/generate')
        .set('Authorization', `Bearer ${physicianToken}`)
        .send({ orderId: 'order-1' });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('DRAFT');
      expect(res.body.orderId).toBe('order-1');
    });

    it('returns 422 when order has no results', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(ORDER_ROW);
      mockPrisma.result.findMany.mockResolvedValue([]); // no results

      const res = await request(app.getHttpServer())
        .post('/api/reports/generate')
        .set('Authorization', `Bearer ${physicianToken}`)
        .send({ orderId: 'order-1' });

      expect(res.status).toBe(422);
    });

    it('returns 401 without token', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/reports/generate')
        .send({ orderId: 'order-1' });

      expect(res.status).toBe(401);
    });

    it('returns 403 for RECEPTION role', async () => {
      const receptionToken = signToken(jwtService, {
        sub: 'user-r',
        email: 'r@lab.com',
        role: UserRole.RECEPTION,
      });

      const res = await request(app.getHttpServer())
        .post('/api/reports/generate')
        .set('Authorization', `Bearer ${receptionToken}`)
        .send({ orderId: 'order-1' });

      expect(res.status).toBe(403);
    });
  });

  // ── POST /api/reports/:id/validate ───────────────────────────────────────

  describe('POST /api/reports/:id/validate', () => {
    it('validates a DRAFT report (DRAFT → VALIDATED)', async () => {
      mockPrisma.report.findUnique.mockResolvedValue(REPORT_ROW);
      mockPrisma.result.findMany.mockResolvedValue([RESULT_ROW]);
      mockPrisma.report.update.mockResolvedValue({
        ...REPORT_ROW,
        status: 'VALIDATED',
        validatedBy: PHYSICIAN_USER.id,
        validatedAt: new Date(),
      });

      const res = await request(app.getHttpServer())
        .post('/api/reports/report-1/validate')
        .set('Authorization', `Bearer ${physicianToken}`)
        .send({});

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('VALIDATED');
    });
  });

  // ── POST /api/reports/:id/publish ─────────────────────────────────────────

  describe('POST /api/reports/:id/publish', () => {
    it('publishes a FINAL report (FINAL → PUBLISHED)', async () => {
      mockPrisma.report.findUnique.mockResolvedValue({
        ...REPORT_ROW,
        status: 'FINAL',
      });
      mockPrisma.report.update.mockResolvedValue({
        ...REPORT_ROW,
        status: 'PUBLISHED',
        publishedAt: new Date(),
      });

      const res = await request(app.getHttpServer())
        .post('/api/reports/report-1/publish')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ publishToPortal: true });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('PUBLISHED');
    });
  });

  // ── GET /api/reports ──────────────────────────────────────────────────────

  describe('GET /api/reports', () => {
    it('returns report list for PHYSICIAN', async () => {
      mockPrisma.report.findMany.mockResolvedValue([REPORT_ROW]);
      mockPrisma.report.count.mockResolvedValue(1);

      const res = await request(app.getHttpServer())
        .get('/api/reports')
        .set('Authorization', `Bearer ${physicianToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });
  });
});
