import { ISampleInventoryLineRepository } from '../../../domain/sample/repositories/ISampleInventoryLineRepository';
import { UpdateSampleInventoryLineDto, SampleInventoryLineDto } from '../dto/SampleInventoryLineDto';

export class UpdateSampleInventoryLine {
  constructor(private readonly repo: ISampleInventoryLineRepository) {}

  async execute(id: string, dto: UpdateSampleInventoryLineDto): Promise<SampleInventoryLineDto> {
    const updated = await this.repo.update(id, dto as never);
    return SampleInventoryLineDto.from(updated);
  }
}
