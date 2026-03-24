/**
 * Mock Prisma service – replaces the real PrismaService in E2E tests.
 * Prevents DB connection while still exercising all layers above Prisma.
 *
 * Usage: configure return values per test, then call jest.clearAllMocks() in beforeEach.
 */

const makeDelegate = () => ({
  findUnique: jest.fn(),
  findFirst: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  createMany: jest.fn(),
  update: jest.fn(),
  updateMany: jest.fn(),
  upsert: jest.fn(),
  delete: jest.fn(),
  deleteMany: jest.fn(),
  count: jest.fn(),
  aggregate: jest.fn(),
  groupBy: jest.fn(),
});

export const mockPrisma = {
  // Lifecycle
  onModuleInit: jest.fn().mockResolvedValue(undefined),
  onModuleDestroy: jest.fn().mockResolvedValue(undefined),
  $connect: jest.fn().mockResolvedValue(undefined),
  $disconnect: jest.fn().mockResolvedValue(undefined),
  // Transaction: resolve all promises in the array
  $transaction: jest
    .fn()
    .mockImplementation((fns: unknown[]) => Promise.all(fns)),

  // Models
  user: makeDelegate(),
  patient: makeDelegate(),
  order: makeDelegate(),
  testOrder: makeDelegate(),
  specimen: makeDelegate(),
  result: makeDelegate(),
  report: makeDelegate(),
  reagent: makeDelegate(),
  reagentLot: makeDelegate(),
  auditEntry: makeDelegate(),
  testDefinition: makeDelegate(),
  storageLocation: makeDelegate(),
};

/** Reset all mock fn state between tests */
export function resetMocks() {
  jest.clearAllMocks();
  // Restore $transaction default impl after clearAllMocks resets it
  (mockPrisma.$transaction as jest.Mock).mockImplementation(
    (fns: unknown[]) => Promise.all(fns),
  );
}
