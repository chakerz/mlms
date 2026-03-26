import { ISampleRepository } from '../../../domain/sample/repositories/ISampleRepository';
import { SampleDto } from '../dto/SampleDto';

export class ListSamples {
  constructor(private readonly repo: ISampleRepository) {}

  async execute(req: { page?: number; pageSize?: number; search?: string; sampleType?: string }) {
    const page = req.page ?? 1;
    const pageSize = req.pageSize ?? 20;
    const { samples, total } = await this.repo.list({ page, pageSize, search: req.search, sampleType: req.sampleType });
    return { data: samples.map(SampleDto.from), total, page, pageSize };
  }
}
