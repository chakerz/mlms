import { Report } from '../../../domain/report/entities/Report';

export class ReportDto {
  id: string;
  orderId: string;
  status: string;
  commentsFr: string | null;
  commentsAr: string | null;
  validatedBy: string | null;
  validatedAt: string | null;
  signedBy: string | null;
  signedAt: string | null;
  publishedAt: string | null;
  templateVersion: string;
  createdAt: string;
  updatedAt: string;

  static from(report: Report): ReportDto {
    const dto = new ReportDto();
    dto.id = report.id;
    dto.orderId = report.orderId;
    dto.status = report.status;
    dto.commentsFr = report.commentsFr;
    dto.commentsAr = report.commentsAr;
    dto.validatedBy = report.validatedBy;
    dto.validatedAt = report.validatedAt?.toISOString() ?? null;
    dto.signedBy = report.signedBy;
    dto.signedAt = report.signedAt?.toISOString() ?? null;
    dto.publishedAt = report.publishedAt?.toISOString() ?? null;
    dto.templateVersion = report.templateVersion;
    dto.createdAt = report.createdAt.toISOString();
    dto.updatedAt = report.updatedAt.toISOString();
    return dto;
  }
}
