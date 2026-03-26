import { ISampleRepository } from '../../../domain/sample/repositories/ISampleRepository';
import { UpdateSampleDto, SampleDto } from '../dto/SampleDto';

export class UpdateSample {
  constructor(private readonly repo: ISampleRepository) {}

  async execute(id: string, dto: UpdateSampleDto): Promise<SampleDto> {
    const updated = await this.repo.update(id, dto as never);
    return SampleDto.from(updated);
  }
}
