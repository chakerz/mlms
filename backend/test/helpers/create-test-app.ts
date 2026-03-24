import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/infrastructure/persistence/prisma/prisma.service';
import { GlobalHttpExceptionFilter } from '../../src/interfaces/http/filters/GlobalHttpExceptionFilter';
import { validationConfig } from '../../src/config/validation.config';
import { PASSWORD_HASHER } from '../../src/modules/shared.module';
import { UserRole } from '../../src/domain/common/types/UserRole';
import { mockPrisma } from './mock-prisma';

export interface TestApp {
  app: INestApplication;
  jwtService: JwtService;
  moduleRef: TestingModule;
}

/** Build a NestJS app with mocked Prisma + mocked password hasher. */
export async function createTestApp(): Promise<TestApp> {
  const mockHasher = {
    hash: jest.fn().mockResolvedValue('$mocked-hash$'),
    compare: jest.fn().mockResolvedValue(true), // always valid in tests
  };

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(PrismaService)
    .useValue(mockPrisma)
    .overrideProvider(PASSWORD_HASHER)
    .useValue(mockHasher)
    .compile();

  const app = moduleRef.createNestApplication();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe(validationConfig));
  app.useGlobalFilters(new GlobalHttpExceptionFilter());
  await app.init();

  const jwtService = moduleRef.get(JwtService);

  return { app, jwtService, moduleRef };
}

/** Sign a JWT with the test JWT secret for a given user profile. */
export function signToken(
  jwtService: JwtService,
  payload: { sub: string; email: string; role: UserRole },
): string {
  return jwtService.sign(payload);
}
