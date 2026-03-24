import { IReportRepository, ListReportsQuery } from '../../../domain/report/repositories/IReportRepository';
import { ReportDto } from '../dto/ReportDto';

export class ListReports {
  constructor(private readonly reportRepo: IReportRepository) {}

  async execute(query: ListReportsQuery): Promise<{ data: ReportDto[]; meta: { page: number; pageSize: number; total: number; totalPages: number } }> {
    const { data, total } = await this.reportRepo.list(query);
    return {
      data: data.map(ReportDto.from),
      meta: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / query.pageSize),
      },
    };
  }
}
