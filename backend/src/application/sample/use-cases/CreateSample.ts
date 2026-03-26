import { ISampleRepository } from '../../../domain/sample/repositories/ISampleRepository';
import { Sample } from '../../../domain/sample/entities/Sample';
import { CreateSampleDto, SampleDto } from '../dto/SampleDto';

export class CreateSample {
  constructor(private readonly repo: ISampleRepository) {}

  async execute(dto: CreateSampleDto): Promise<SampleDto> {
    const entity = new Sample('', dto.sampleCode, dto.name, dto.sampleType,
      dto.sampleDescription ?? null, dto.collectionMethod ?? null, dto.containerType ?? null,
      dto.storageConditions ?? null, dto.handlingInstructions ?? null,
      dto.sampleStatus ?? 'Active', dto.qcPassed ?? true, dto.qcNotes ?? null, new Date(), new Date());
    const saved = await this.repo.save(entity);
    return SampleDto.from(saved);
  }
}
