import { ISampleRepository } from '../../../domain/sample/repositories/ISampleRepository';
import { SampleDto } from '../dto/SampleDto';

export class GetSampleById {
  constructor(private readonly repo: ISampleRepository) {}

  async execute(id: string): Promise<SampleDto> {
    const entity = await this.repo.findById(id);
    if (!entity) throw new Error(`Sample ${id} not found`);
    return SampleDto.from(entity);
  }
}
