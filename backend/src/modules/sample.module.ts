import { Module } from '@nestjs/common';
import { SharedModule } from './shared.module';
import { PersistenceModule, SAMPLE_REPOSITORY, SAMPLE_INVENTORY_LINE_REPOSITORY } from './persistence.module';
import { ISampleRepository } from '../domain/sample/repositories/ISampleRepository';
import { ISampleInventoryLineRepository } from '../domain/sample/repositories/ISampleInventoryLineRepository';
import { CreateSample } from '../application/sample/use-cases/CreateSample';
import { GetSampleById } from '../application/sample/use-cases/GetSampleById';
import { ListSamples } from '../application/sample/use-cases/ListSamples';
import { UpdateSample } from '../application/sample/use-cases/UpdateSample';
import { CreateSampleInventoryLine } from '../application/sample/use-cases/CreateSampleInventoryLine';
import { GetSampleInventoryLineById } from '../application/sample/use-cases/GetSampleInventoryLineById';
import { ListSampleInventoryLines } from '../application/sample/use-cases/ListSampleInventoryLines';
import { UpdateSampleInventoryLine } from '../application/sample/use-cases/UpdateSampleInventoryLine';
import { SampleController } from '../interfaces/http/controllers/SampleController';

@Module({
  imports: [SharedModule, PersistenceModule],
  providers: [
    { provide: CreateSample, useFactory: (r: ISampleRepository) => new CreateSample(r), inject: [SAMPLE_REPOSITORY] },
    { provide: GetSampleById, useFactory: (r: ISampleRepository) => new GetSampleById(r), inject: [SAMPLE_REPOSITORY] },
    { provide: ListSamples, useFactory: (r: ISampleRepository) => new ListSamples(r), inject: [SAMPLE_REPOSITORY] },
    { provide: UpdateSample, useFactory: (r: ISampleRepository) => new UpdateSample(r), inject: [SAMPLE_REPOSITORY] },
    { provide: CreateSampleInventoryLine, useFactory: (r: ISampleInventoryLineRepository) => new CreateSampleInventoryLine(r), inject: [SAMPLE_INVENTORY_LINE_REPOSITORY] },
    { provide: GetSampleInventoryLineById, useFactory: (r: ISampleInventoryLineRepository) => new GetSampleInventoryLineById(r), inject: [SAMPLE_INVENTORY_LINE_REPOSITORY] },
    { provide: ListSampleInventoryLines, useFactory: (r: ISampleInventoryLineRepository) => new ListSampleInventoryLines(r), inject: [SAMPLE_INVENTORY_LINE_REPOSITORY] },
    { provide: UpdateSampleInventoryLine, useFactory: (r: ISampleInventoryLineRepository) => new UpdateSampleInventoryLine(r), inject: [SAMPLE_INVENTORY_LINE_REPOSITORY] },
  ],
  controllers: [SampleController],
})
export class SampleModule {}
