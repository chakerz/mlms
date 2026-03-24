import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createTestApp, signToken } from '../helpers/create-test-app';
import { mockPrisma, resetMocks } from '../helpers/mock-prisma';
import { ADMIN_USER, PATIENT_ROW, ORDER_ROW } from '../helpers/fixtures';
import { UserRole } from '../../src/domain/common/types/UserRole';

describe('Order E2E', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let adminToken: string;

  beforeAll(async () => {
    ({ app, jwtService } = await createTestApp());
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

  // ── POST /api/orders ─────────────────────────────────────────────────────

  describe('POST /api/orders', () => {
    it('creates an order with tests and returns 201', async () => {
      mockPrisma.patient.findUnique.mockResolvedValue(PATIENT_ROW);
      mockPrisma.order.create.mockResolvedValue(ORDER_ROW);

      const res = await request(app.getHttpServer())
        .post('/api/orders')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          patientId: 'patient-1',
          priority: 'ROUTINE',
          tests: [
            {
              testCode: 'GLU',
              testNameFr: 'Glycémie',
              testNameAr: 'سكر الدم',
              priority: 'ROUTINE',
            },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.patientId).toBe('patient-1');
      expect(res.body.status).toBe('PENDING');
      expect(res.body.tests).toHaveLength(1);
    });

    it('returns 401 without token', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/orders')
        .send({ patientId: 'p1', priority: 'ROUTINE', tests: [] });

      expect(res.status).toBe(401);
    });

    it('returns 400 for missing tests array', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/orders')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ patientId: 'patient-1', priority: 'ROUTINE' }); // missing tests

      expect(res.status).toBe(400);
    });
  });

  // ── GET /api/orders/:id ──────────────────────────────────────────────────

  describe('GET /api/orders/:id', () => {
    it('returns order by ID', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(ORDER_ROW);

      const res = await request(app.getHttpServer())
        .get('/api/orders/order-1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe('order-1');
      expect(res.body.tests).toHaveLength(1);
    });

    it('returns 404 for unknown order', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(null);

      const res = await request(app.getHttpServer())
        .get('/api/orders/nonexistent')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });
  });

  // ── GET /api/orders ──────────────────────────────────────────────────────

  describe('GET /api/orders', () => {
    it('returns paginated order list', async () => {
      mockPrisma.order.findMany.mockResolvedValue([ORDER_ROW]);
      mockPrisma.order.count.mockResolvedValue(1);

      const res = await request(app.getHttpServer())
        .get('/api/orders')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.meta.total).toBe(1);
    });
  });
});
