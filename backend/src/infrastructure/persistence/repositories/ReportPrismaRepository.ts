import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  IReportRepository,
  UpdateReportData,
  ListReportsQuery,
} from '../../../domain/report/repositories/IReportRepository';
import { Report } from '../../../domain/report/entities/Report';
import { ReportStatus } from '../../../domain/report/types/ReportStatus';

type PrismaReportRow = {
  id: string;
  orderId: string;
  status: string;
  commentsFr: string | null;
  commentsAr: string | null;
  validatedBy: string | null;
  validatedAt: Date | null;
  signedBy: string | null;
  signedAt: Date | null;
  publishedAt: Date | null;
  templateVersion: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class ReportPrismaRepository implements IReportRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Report | null> {
    const row = await this.prisma.report.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByOrderId(orderId: string): Promise<Report[]> {
    const rows = await this.prisma.report.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => this.toDomain(r));
  }

  private readonly VALID_STATUSES = new Set(['DRAFT', 'VALIDATED', 'FINAL', 'CORRECTED', 'PUBLISHED']);

  async list(query: ListReportsQuery): Promise<{ data: Report[]; total: number }> {
    const where: Record<string, unknown> = {};
    if (query.status && this.VALID_STATUSES.has(query.status)) {
      where['status'] = query.status as unknown as import('@prisma/client').ReportStatus;
    }
    if (query.orderId) where['orderId'] = query.orderId;

    const [rows, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.report.count({ where }),
    ]);

    return { data: rows.map((r) => this.toDomain(r)), total };
  }

  async save(report: Report): Promise<Report> {
    const row = await this.prisma.report.create({
      data: {
        orderId: report.orderId,
        status: report.status as unknown as import('@prisma/client').ReportStatus,
        commentsFr: report.commentsFr,
        commentsAr: report.commentsAr,
        validatedBy: report.validatedBy,
        validatedAt: report.validatedAt,
        signedBy: report.signedBy,
        signedAt: report.signedAt,
        publishedAt: report.publishedAt,
        templateVersion: report.templateVersion,
      },
    });
    return this.toDomain(row);
  }

  async update(id: string, data: UpdateReportData): Promise<Report> {
    const patch: Record<string, unknown> = {};
    if (data.status !== undefined) {
      patch['status'] = data.status as unknown as import('@prisma/client').ReportStatus;
    }
    if (data.commentsFr !== undefined) patch['commentsFr'] = data.commentsFr;
    if (data.commentsAr !== undefined) patch['commentsAr'] = data.commentsAr;
    if (data.validatedBy !== undefined) patch['validatedBy'] = data.validatedBy;
    if (data.validatedAt !== undefined) patch['validatedAt'] = data.validatedAt;
    if (data.signedBy !== undefined) patch['signedBy'] = data.signedBy;
    if (data.signedAt !== undefined) patch['signedAt'] = data.signedAt;
    if (data.publishedAt !== undefined) patch['publishedAt'] = data.publishedAt;

    const row = await this.prisma.report.update({ where: { id }, data: patch });
    return this.toDomain(row);
  }

  private toDomain(row: PrismaReportRow): Report {
    return new Report(
      row.id,
      row.orderId,
      row.status as ReportStatus,
      row.commentsFr,
      row.commentsAr,
      row.validatedBy,
      row.validatedAt,
      row.signedBy,
      row.signedAt,
      row.publishedAt,
      row.templateVersion,
      row.createdAt,
      row.updatedAt,
    );
  }
}
