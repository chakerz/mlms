import { Module } from '@nestjs/common';
import { SharedModule } from './shared.module';
import { PersistenceModule, QC_MATERIAL_REPOSITORY, QC_SCHEDULE_REPOSITORY, QC_RESULT_REPOSITORY } from './persistence.module';
import { IQCMaterialRepository } from '../domain/qc/repositories/IQCMaterialRepository';
import { IQCScheduleRepository } from '../domain/qc/repositories/IQCScheduleRepository';
import { IQCResultRepository } from '../domain/qc/repositories/IQCResultRepository';
import { CreateQCMaterial } from '../application/qc/use-cases/CreateQCMaterial';
import { GetQCMaterialById } from '../application/qc/use-cases/GetQCMaterialById';
import { ListQCMaterials } from '../application/qc/use-cases/ListQCMaterials';
import { UpdateQCMaterial } from '../application/qc/use-cases/UpdateQCMaterial';
import { CreateQCSchedule } from '../application/qc/use-cases/CreateQCSchedule';
import { GetQCScheduleById } from '../application/qc/use-cases/GetQCScheduleById';
import { ListQCSchedules } from '../application/qc/use-cases/ListQCSchedules';
import { UpdateQCSchedule } from '../application/qc/use-cases/UpdateQCSchedule';
import { CreateQCResult } from '../application/qc/use-cases/CreateQCResult';
import { GetQCResultById } from '../application/qc/use-cases/GetQCResultById';
import { ListQCResults } from '../application/qc/use-cases/ListQCResults';
import { UpdateQCResult } from '../application/qc/use-cases/UpdateQCResult';
import { QCController } from '../interfaces/http/controllers/QCController';

@Module({
  imports: [SharedModule, PersistenceModule],
  providers: [
    { provide: CreateQCMaterial, useFactory: (r: IQCMaterialRepository) => new CreateQCMaterial(r), inject: [QC_MATERIAL_REPOSITORY] },
    { provide: GetQCMaterialById, useFactory: (r: IQCMaterialRepository) => new GetQCMaterialById(r), inject: [QC_MATERIAL_REPOSITORY] },
    { provide: ListQCMaterials, useFactory: (r: IQCMaterialRepository) => new ListQCMaterials(r), inject: [QC_MATERIAL_REPOSITORY] },
    { provide: UpdateQCMaterial, useFactory: (r: IQCMaterialRepository) => new UpdateQCMaterial(r), inject: [QC_MATERIAL_REPOSITORY] },
    { provide: CreateQCSchedule, useFactory: (r: IQCScheduleRepository) => new CreateQCSchedule(r), inject: [QC_SCHEDULE_REPOSITORY] },
    { provide: GetQCScheduleById, useFactory: (r: IQCScheduleRepository) => new GetQCScheduleById(r), inject: [QC_SCHEDULE_REPOSITORY] },
    { provide: ListQCSchedules, useFactory: (r: IQCScheduleRepository) => new ListQCSchedules(r), inject: [QC_SCHEDULE_REPOSITORY] },
    { provide: UpdateQCSchedule, useFactory: (r: IQCScheduleRepository) => new UpdateQCSchedule(r), inject: [QC_SCHEDULE_REPOSITORY] },
    { provide: CreateQCResult, useFactory: (r: IQCResultRepository) => new CreateQCResult(r), inject: [QC_RESULT_REPOSITORY] },
    { provide: GetQCResultById, useFactory: (r: IQCResultRepository) => new GetQCResultById(r), inject: [QC_RESULT_REPOSITORY] },
    { provide: ListQCResults, useFactory: (r: IQCResultRepository) => new ListQCResults(r), inject: [QC_RESULT_REPOSITORY] },
    { provide: UpdateQCResult, useFactory: (r: IQCResultRepository) => new UpdateQCResult(r), inject: [QC_RESULT_REPOSITORY] },
  ],
  controllers: [QCController],
})
export class QCModule {}
