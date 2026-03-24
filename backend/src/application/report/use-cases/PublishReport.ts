import { IReportRepository } from '../../../domain/report/repositories/IReportRepository';
import { ReportStatus } from '../../../domain/report/types/ReportStatus';
import { DomainNotFoundException } from '../../../domain/common/exceptions/NotFoundException';
import { DomainValidationException } from '../../../domain/common/exceptions/ValidationException';
import { PublishReportDto } from '../dto/PublishReportDto';
import { ReportDto } from '../dto/ReportDto';

export class PublishReport {
  constructor(private readonly reportRepo: IReportRepository) {}

  async execute(id: string, dto: PublishReportDto): Promise<ReportDto> {
    const report = await this.reportRepo.findById(id);
    if (!report) throw new DomainNotFoundException('Report', id);

    if (report.status !== ReportStatus.FINAL) {
      throw new DomainValidationException(
        `Cannot publish report in status ${report.status}. Expected FINAL.`,
      );
    }

    const updated = await this.reportRepo.update(id, {
      status: ReportStatus.PUBLISHED,
      publishedAt: new Date(),
    });

    return ReportDto.from(updated);
  }
}
