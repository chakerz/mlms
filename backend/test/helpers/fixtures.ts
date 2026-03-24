/**
 * Shared test fixtures – plain Prisma-shaped objects matching the DB schema.
 * Reset mocks between tests; these are only data shapes, not live records.
 */

export const ADMIN_USER = {
  id: 'user-admin-1',
  email: 'admin@lab.com',
  passwordHash: '$2b$10$mockhash',
  role: 'ADMIN',
  language: 'fr',
  isActive: true,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

export const PHYSICIAN_USER = {
  id: 'user-physician-1',
  email: 'physician@lab.com',
  passwordHash: '$2b$10$mockhash',
  role: 'PHYSICIAN',
  language: 'fr',
  isActive: true,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

export const RECEPTION_USER = {
  id: 'user-reception-1',
  email: 'reception@lab.com',
  passwordHash: '$2b$10$mockhash',
  role: 'RECEPTION',
  language: 'fr',
  isActive: true,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

export const PATIENT_ROW = {
  id: 'patient-1',
  firstName: 'Amina',
  lastName: 'El Idrissi',
  birthDate: new Date('1992-05-12'),
  gender: 'F',
  phone: '+212600000001',
  email: 'amina@example.com',
  address: 'Casablanca, Maroc',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

export const ORDER_ROW = {
  id: 'order-1',
  patientId: 'patient-1',
  status: 'PENDING',
  priority: 'ROUTINE',
  createdBy: 'user-admin-1',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  tests: [
    {
      id: 'test-order-1',
      orderId: 'order-1',
      testCode: 'GLU',
      testNameFr: 'Glycémie',
      testNameAr: 'سكر الدم',
      priority: 'ROUTINE',
      notes: null,
    },
  ],
};

export const RESULT_ROW = {
  id: 'result-1',
  specimenId: 'specimen-1',
  orderId: 'order-1',
  testCode: 'GLU',
  testNameFr: 'Glycémie',
  testNameAr: 'سكر الدم',
  value: '7.2',
  unit: 'mmol/L',
  referenceLow: 3.9,
  referenceHigh: 6.1,
  flag: 'H',
  measuredAt: new Date('2026-01-01T10:00:00Z'),
  recordedBy: 'user-admin-1',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

export const REPORT_ROW = {
  id: 'report-1',
  orderId: 'order-1',
  status: 'DRAFT',
  commentsFr: null,
  commentsAr: null,
  validatedBy: null,
  validatedAt: null,
  signedBy: null,
  signedAt: null,
  publishedAt: null,
  templateVersion: 'v1',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};
