import { ISampleInventoryLineRepository } from '../../../domain/sample/repositories/ISampleInventoryLineRepository';
import { SampleInventoryLineDto } from '../dto/SampleInventoryLineDto';

export class GetSampleInventoryLineById {
  constructor(private readonly repo: ISampleInventoryLineRepository) {}

  async execute(id: string): Promise<SampleInventoryLineDto> {
    const entity = await this.repo.findById(id);
    if (!entity) throw new Error(`SampleInventoryLine ${id} not found`);
    return SampleInventoryLineDto.from(entity);
  }
}
