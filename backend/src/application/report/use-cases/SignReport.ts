import { IReportRepository } from '../../../domain/report/repositories/IReportRepository';
import { ReportStatus } from '../../../domain/report/types/ReportStatus';
import { DomainNotFoundException } from '../../../domain/common/exceptions/NotFoundException';
import { DomainValidationException } from '../../../domain/common/exceptions/ValidationException';
import { SignReportDto } from '../dto/SignReportDto';
import { ReportDto } from '../dto/ReportDto';

export class SignReport {
  constructor(private readonly reportRepo: IReportRepository) {}

  async execute(id: string, dto: SignReportDto, signedBy: string): Promise<ReportDto> {
    const report = await this.reportRepo.findById(id);
    if (!report) throw new DomainNotFoundException('Report', id);

    if (report.status !== ReportStatus.VALIDATED) {
      throw new DomainValidationException(
        `Cannot sign report in status ${report.status}. Expected VALIDATED.`,
      );
    }

    const patch: { status: ReportStatus; signedBy: string; signedAt: Date; commentsFr?: string | null; commentsAr?: string | null } = {
      status: ReportStatus.FINAL,
      signedBy,
      signedAt: new Date(),
    };

    if (dto.commentsFr !== undefined) patch.commentsFr = dto.commentsFr;
    if (dto.commentsAr !== undefined) patch.commentsAr = dto.commentsAr;

    const updated = await this.reportRepo.update(id, patch);
    return ReportDto.from(updated);
  }
}
