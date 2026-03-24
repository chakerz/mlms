import { IReportRepository } from '../../../domain/report/repositories/IReportRepository';
import { IResultRepository } from '../../../domain/result/repositories/IResultRepository';
import { ReportStatus } from '../../../domain/report/types/ReportStatus';
import { DomainNotFoundException } from '../../../domain/common/exceptions/NotFoundException';
import { DomainValidationException } from '../../../domain/common/exceptions/ValidationException';
import { ValidateReportDto } from '../dto/ValidateReportDto';
import { ReportDto } from '../dto/ReportDto';

export class ValidateReport {
  constructor(
    private readonly reportRepo: IReportRepository,
    private readonly resultRepo: IResultRepository,
  ) {}

  async execute(id: string, dto: ValidateReportDto, validatedBy: string): Promise<ReportDto> {
    const report = await this.reportRepo.findById(id);
    if (!report) throw new DomainNotFoundException('Report', id);

    if (report.status !== ReportStatus.DRAFT) {
      throw new DomainValidationException(
        `Cannot validate report in status ${report.status}. Expected DRAFT.`,
      );
    }

    const results = await this.resultRepo.findByOrderId(report.orderId);
    if (results.length === 0) {
      throw new DomainValidationException('Cannot validate report: no results found for this order');
    }

    const updated = await this.reportRepo.update(id, {
      status: ReportStatus.VALIDATED,
      commentsFr: dto.commentsFr ?? null,
      commentsAr: dto.commentsAr ?? null,
      validatedBy,
      validatedAt: new Date(),
    });

    return ReportDto.from(updated);
  }
}
