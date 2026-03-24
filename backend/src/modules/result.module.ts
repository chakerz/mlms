import { Module } from '@nestjs/common';
import { SharedModule } from './shared.module';
import { PersistenceModule, RESULT_REPOSITORY, SPECIMEN_REPOSITORY } from './persistence.module';
import { IResultRepository } from '../domain/result/repositories/IResultRepository';
import { ISpecimenRepository } from '../domain/specimen/repositories/ISpecimenRepository';
import { RecordResult } from '../application/result/use-cases/RecordResult';
import { UpdateResult } from '../application/result/use-cases/UpdateResult';
import { ListResultsBySpecimen } from '../application/result/use-cases/ListResultsBySpecimen';
import { ListResultsByOrder } from '../application/result/use-cases/ListResultsByOrder';
import { ResultController } from '../interfaces/http/controllers/ResultController';

@Module({
  imports: [SharedModule, PersistenceModule],
  providers: [
    {
      provide: RecordResult,
      useFactory: (resultRepo: IResultRepository, specimenRepo: ISpecimenRepository) =>
        new RecordResult(resultRepo, specimenRepo),
      inject: [RESULT_REPOSITORY, SPECIMEN_REPOSITORY],
    },
    {
      provide: UpdateResult,
      useFactory: (repo: IResultRepository) => new UpdateResult(repo),
      inject: [RESULT_REPOSITORY],
    },
    {
      provide: ListResultsBySpecimen,
      useFactory: (repo: IResultRepository) => new ListResultsBySpecimen(repo),
      inject: [RESULT_REPOSITORY],
    },
    {
      provide: ListResultsByOrder,
      useFactory: (repo: IResultRepository) => new ListResultsByOrder(repo),
      inject: [RESULT_REPOSITORY],
    },
  ],
  controllers: [ResultController],
  exports: [ListResultsBySpecimen, ListResultsByOrder],
})
export class ResultModule {}
