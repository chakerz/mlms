import { Module } from '@nestjs/common';
import { SharedModule } from './shared.module';
import {
  PersistenceModule,
  REPORT_REPOSITORY,
  ORDER_REPOSITORY,
  PATIENT_REPOSITORY,
  RESULT_REPOSITORY,
} from './persistence.module';
import { IReportRepository } from '../domain/report/repositories/IReportRepository';
import { IOrderRepository } from '../domain/order/repositories/IOrderRepository';
import { IPatientRepository } from '../domain/patient/repositories/IPatientRepository';
import { IResultRepository } from '../domain/result/repositories/IResultRepository';
import { GetPortalReports } from '../application/portal/use-cases/GetPortalReports';
import { GetPortalReportById } from '../application/portal/use-cases/GetPortalReportById';
import { GetPortalMe } from '../application/portal/use-cases/GetPortalMe';
import { PortalController } from '../interfaces/http/controllers/PortalController';

@Module({
  imports: [SharedModule, PersistenceModule],
  providers: [
    {
      provide: GetPortalReports,
      useFactory: (
        reportRepo: IReportRepository,
        orderRepo: IOrderRepository,
        patientRepo: IPatientRepository,
      ) => new GetPortalReports(reportRepo, orderRepo, patientRepo),
      inject: [REPORT_REPOSITORY, ORDER_REPOSITORY, PATIENT_REPOSITORY],
    },
    {
      provide: GetPortalReportById,
      useFactory: (
        reportRepo: IReportRepository,
        orderRepo: IOrderRepository,
        patientRepo: IPatientRepository,
        resultRepo: IResultRepository,
      ) => new GetPortalReportById(reportRepo, orderRepo, patientRepo, resultRepo),
      inject: [REPORT_REPOSITORY, ORDER_REPOSITORY, PATIENT_REPOSITORY, RESULT_REPOSITORY],
    },
    {
      provide: GetPortalMe,
      useFactory: (patientRepo: IPatientRepository) => new GetPortalMe(patientRepo),
      inject: [PATIENT_REPOSITORY],
    },
  ],
  controllers: [PortalController],
})
export class PortalModule {}
