import { IQCScheduleRepository } from '../../../domain/qc/repositories/IQCScheduleRepository';
import { QCScheduleDto } from '../dto/QCScheduleDto';

export class ListQCSchedules {
  constructor(private readonly repo: IQCScheduleRepository) {}

  async execute(req: { page?: number; pageSize?: number; status?: string }) {
    const page = req.page ?? 1;
    const pageSize = req.pageSize ?? 20;
    const { schedules, total } = await this.repo.list({ page, pageSize, status: req.status });
    return { data: schedules.map(QCScheduleDto.from), total, page, pageSize };
  }
}
