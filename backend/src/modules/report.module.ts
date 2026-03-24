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
import { GenerateReport } from '../application/report/use-cases/GenerateReport';
import { ValidateReport } from '../application/report/use-cases/ValidateReport';
import { SignReport } from '../application/report/use-cases/SignReport';
import { PublishReport } from '../application/report/use-cases/PublishReport';
import { GetReportById } from '../application/report/use-cases/GetReportById';
import { ListReports } from '../application/report/use-cases/ListReports';
import { ReportController } from '../interfaces/http/controllers/ReportController';

@Module({
  imports: [SharedModule, PersistenceModule],
  providers: [
    {
      provide: GenerateReport,
      useFactory: (
        reportRepo: IReportRepository,
        orderRepo: IOrderRepository,
        resultRepo: IResultRepository,
      ) => new GenerateReport(reportRepo, orderRepo, resultRepo),
      inject: [REPORT_REPOSITORY, ORDER_REPOSITORY, RESULT_REPOSITORY],
    },
    {
      provide: ValidateReport,
      useFactory: (reportRepo: IReportRepository, resultRepo: IResultRepository) =>
        new ValidateReport(reportRepo, resultRepo),
      inject: [REPORT_REPOSITORY, RESULT_REPOSITORY],
    },
    {
      provide: SignReport,
      useFactory: (reportRepo: IReportRepository) => new SignReport(reportRepo),
      inject: [REPORT_REPOSITORY],
    },
    {
      provide: PublishReport,
      useFactory: (reportRepo: IReportRepository) => new PublishReport(reportRepo),
      inject: [REPORT_REPOSITORY],
    },
    {
      provide: GetReportById,
      useFactory: (
        reportRepo: IReportRepository,
        orderRepo: IOrderRepository,
        patientRepo: IPatientRepository,
        resultRepo: IResultRepository,
      ) => new GetReportById(reportRepo, orderRepo, patientRepo, resultRepo),
      inject: [REPORT_REPOSITORY, ORDER_REPOSITORY, PATIENT_REPOSITORY, RESULT_REPOSITORY],
    },
    {
      provide: ListReports,
      useFactory: (reportRepo: IReportRepository) => new ListReports(reportRepo),
      inject: [REPORT_REPOSITORY],
    },
  ],
  controllers: [ReportController],
})
export class ReportModule {}
