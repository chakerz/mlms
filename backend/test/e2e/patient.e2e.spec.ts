import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createTestApp, signToken } from '../helpers/create-test-app';
import { mockPrisma, resetMocks } from '../helpers/mock-prisma';
import { ADMIN_USER, PATIENT_ROW } from '../helpers/fixtures';
import { UserRole } from '../../src/domain/common/types/UserRole';

describe('Patient E2E', () => {
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

  // ── POST /api/patients ───────────────────────────────────────────────────

  describe('POST /api/patients', () => {
    it('creates a patient and returns 201', async () => {
      mockPrisma.patient.create.mockResolvedValue(PATIENT_ROW);

      const res = await request(app.getHttpServer())
        .post('/api/patients')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          firstName: 'Amina',
          lastName: 'El Idrissi',
          birthDate: '1992-05-12',
          gender: 'F',
          phone: '+212600000001',
          email: 'amina@example.com',
        });

      expect(res.status).toBe(201);
      expect(res.body.firstName).toBe('Amina');
      expect(res.body.lastName).toBe('El Idrissi');
    });

    it('returns 401 without authentication', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/patients')
        .send({ firstName: 'X', lastName: 'Y', birthDate: '2000-01-01', gender: 'M' });

      expect(res.status).toBe(401);
    });

    it('returns 400 for missing required fields', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/patients')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ firstName: 'OnlyFirst' }); // missing lastName, birthDate, gender

      expect(res.status).toBe(400);
    });
  });

  // ── GET /api/patients ────────────────────────────────────────────────────

  describe('GET /api/patients', () => {
    it('returns patient list with pagination', async () => {
      mockPrisma.patient.findMany.mockResolvedValue([PATIENT_ROW]);
      mockPrisma.patient.count.mockResolvedValue(1);

      const res = await request(app.getHttpServer())
        .get('/api/patients')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].firstName).toBe('Amina');
      expect(res.body.meta).toHaveProperty('total', 1);
    });

    it('returns 401 without authentication', async () => {
      const res = await request(app.getHttpServer()).get('/api/patients');
      expect(res.status).toBe(401);
    });
  });

  // ── GET /api/patients/:id ─────────────────────────────────────────────────

  describe('GET /api/patients/:id', () => {
    it('returns patient by ID', async () => {
      mockPrisma.patient.findUnique.mockResolvedValue(PATIENT_ROW);

      const res = await request(app.getHttpServer())
        .get('/api/patients/patient-1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe('patient-1');
    });

    it('returns 404 for unknown patient', async () => {
      mockPrisma.patient.findUnique.mockResolvedValue(null);

      const res = await request(app.getHttpServer())
        .get('/api/patients/nonexistent')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });
  });
});
