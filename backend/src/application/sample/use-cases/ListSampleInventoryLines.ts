import { ISampleInventoryLineRepository } from '../../../domain/sample/repositories/ISampleInventoryLineRepository';
import { SampleInventoryLineDto } from '../dto/SampleInventoryLineDto';

export class ListSampleInventoryLines {
  constructor(private readonly repo: ISampleInventoryLineRepository) {}

  async execute(req: { page?: number; pageSize?: number; sampleId?: string; currentStatus?: string; search?: string }) {
    const page = req.page ?? 1;
    const pageSize = req.pageSize ?? 20;
    const { lines, total } = await this.repo.list({ page, pageSize, sampleId: req.sampleId, currentStatus: req.currentStatus, search: req.search });
    return { data: lines.map(SampleInventoryLineDto.from), total, page, pageSize };
  }
}
