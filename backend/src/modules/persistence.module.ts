import { Module } from '@nestjs/common';
import { PrismaModule } from '../infrastructure/persistence/prisma/prisma.module';
import { UserPrismaRepository } from '../infrastructure/persistence/repositories/UserPrismaRepository';
import { PatientPrismaRepository } from '../infrastructure/persistence/repositories/PatientPrismaRepository';
import { OrderPrismaRepository } from '../infrastructure/persistence/repositories/OrderPrismaRepository';
import { SpecimenPrismaRepository } from '../infrastructure/persistence/repositories/SpecimenPrismaRepository';
import { ResultPrismaRepository } from '../infrastructure/persistence/repositories/ResultPrismaRepository';
import { ReportPrismaRepository } from '../infrastructure/persistence/repositories/ReportPrismaRepository';
import { ReagentPrismaRepository } from '../infrastructure/persistence/repositories/ReagentPrismaRepository';
import { TestDefinitionPrismaRepository } from '../infrastructure/persistence/repositories/TestDefinitionPrismaRepository';
import { NonConformitePrismaRepository } from '../infrastructure/persistence/repositories/NonConformitePrismaRepository';

export const USER_REPOSITORY = 'IUserRepository';
export const PATIENT_REPOSITORY = 'IPatientRepository';
export const ORDER_REPOSITORY = 'IOrderRepository';
export const SPECIMEN_REPOSITORY = 'ISpecimenRepository';
export const RESULT_REPOSITORY = 'IResultRepository';
export const REPORT_REPOSITORY = 'IReportRepository';
export const REAGENT_REPOSITORY = 'IReagentRepository';
export const TEST_DEFINITION_REPOSITORY = 'ITestDefinitionRepository';
export const NON_CONFORMITE_REPOSITORY = 'INonConformiteRepository';

@Module({
  imports: [PrismaModule],
  providers: [
    { provide: USER_REPOSITORY, useClass: UserPrismaRepository },
    { provide: PATIENT_REPOSITORY, useClass: PatientPrismaRepository },
    { provide: ORDER_REPOSITORY, useClass: OrderPrismaRepository },
    { provide: SPECIMEN_REPOSITORY, useClass: SpecimenPrismaRepository },
    { provide: RESULT_REPOSITORY, useClass: ResultPrismaRepository },
    { provide: REPORT_REPOSITORY, useClass: ReportPrismaRepository },
    { provide: REAGENT_REPOSITORY, useClass: ReagentPrismaRepository },
    { provide: TEST_DEFINITION_REPOSITORY, useClass: TestDefinitionPrismaRepository },
    { provide: NON_CONFORMITE_REPOSITORY, useClass: NonConformitePrismaRepository },
  ],
  exports: [USER_REPOSITORY, PATIENT_REPOSITORY, ORDER_REPOSITORY, SPECIMEN_REPOSITORY, RESULT_REPOSITORY, REPORT_REPOSITORY, REAGENT_REPOSITORY, TEST_DEFINITION_REPOSITORY, NON_CONFORMITE_REPOSITORY],
})
export class PersistenceModule {}
