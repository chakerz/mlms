import { Module } from '@nestjs/common';
import { SharedModule } from './shared.module';
import { PersistenceModule, SPECIMEN_REPOSITORY, ORDER_REPOSITORY, RESULT_REPOSITORY } from './persistence.module';
import { ISpecimenRepository } from '../domain/specimen/repositories/ISpecimenRepository';
import { IOrderRepository } from '../domain/order/repositories/IOrderRepository';
import { IResultRepository } from '../domain/result/repositories/IResultRepository';
import { ListResultsBySpecimen } from '../application/result/use-cases/ListResultsBySpecimen';
import { CreateSpecimen } from '../application/specimen/use-cases/CreateSpecimen';
import { GetSpecimenById } from '../application/specimen/use-cases/GetSpecimenById';
import { ListSpecimensByOrder } from '../application/specimen/use-cases/ListSpecimensByOrder';
import { ListAllSpecimens } from '../application/specimen/use-cases/ListAllSpecimens';
import { UpdateSpecimenStatus } from '../application/specimen/use-cases/UpdateSpecimenStatus';
import { SpecimenController } from '../interfaces/http/controllers/SpecimenController';

@Module({
  imports: [SharedModule, PersistenceModule],
  providers: [
    {
      provide: CreateSpecimen,
      useFactory: (specimenRepo: ISpecimenRepository, orderRepo: IOrderRepository) =>
        new CreateSpecimen(specimenRepo, orderRepo),
      inject: [SPECIMEN_REPOSITORY, ORDER_REPOSITORY],
    },
    {
      provide: GetSpecimenById,
      useFactory: (repo: ISpecimenRepository) => new GetSpecimenById(repo),
      inject: [SPECIMEN_REPOSITORY],
    },
    {
      provide: ListSpecimensByOrder,
      useFactory: (repo: ISpecimenRepository) => new ListSpecimensByOrder(repo),
      inject: [SPECIMEN_REPOSITORY],
    },
    {
      provide: UpdateSpecimenStatus,
      useFactory: (repo: ISpecimenRepository) => new UpdateSpecimenStatus(repo),
      inject: [SPECIMEN_REPOSITORY],
    },
    {
      provide: ListAllSpecimens,
      useFactory: (repo: ISpecimenRepository) => new ListAllSpecimens(repo),
      inject: [SPECIMEN_REPOSITORY],
    },
    {
      provide: ListResultsBySpecimen,
      useFactory: (repo: IResultRepository) => new ListResultsBySpecimen(repo),
      inject: [RESULT_REPOSITORY],
    },
  ],
  controllers: [SpecimenController],
  exports: [ListSpecimensByOrder],
})
export class SpecimenModule {}
