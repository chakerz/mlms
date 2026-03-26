import { IQCResultRepository } from '../../../domain/qc/repositories/IQCResultRepository';
import { QCResultDto } from '../dto/QCResultDto';

export class ListQCResults {
  constructor(private readonly repo: IQCResultRepository) {}

  async execute(req: { page?: number; pageSize?: number; status?: string; alert?: string; qcScheduleId?: string }) {
    const page = req.page ?? 1;
    const pageSize = req.pageSize ?? 20;
    const { results, total } = await this.repo.list({ page, pageSize, status: req.status, alert: req.alert, qcScheduleId: req.qcScheduleId });
    return { data: results.map(QCResultDto.from), total, page, pageSize };
  }
}
