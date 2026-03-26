import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IQCResultRepository, ListQCResultsQuery } from '../../../domain/qc/repositories/IQCResultRepository';
import { QCResult } from '../../../domain/qc/entities/QCResult';

@Injectable()
export class QCResultPrismaRepository implements IQCResultRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<QCResult | null> {
    const row = await this.prisma.qCResult.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async save(result: QCResult): Promise<QCResult> {
    const row = await this.prisma.qCResult.create({
      data: {
        qcScheduleId: result.qcScheduleId,
        testId: result.testId,
        testName: result.testName,
        controlMaterialId: result.controlMaterialId,
        resultValue: result.resultValue,
        performedDate: result.performedDate,
        performedBy: result.performedBy,
        status: result.status as never,
        acceptableLimitLow: result.acceptableLimitLow,
        acceptableLimitHigh: result.acceptableLimitHigh,
        warningLimitLow: result.warningLimitLow,
        warningLimitHigh: result.warningLimitHigh,
        qualitativeObservation: result.qualitativeObservation,
        alert: result.alert as never,
        comments: result.comments,
      },
    });
    return this.toDomain(row);
  }

  async update(id: string, data: Partial<QCResult>): Promise<QCResult> {
    const row = await this.prisma.qCResult.update({ where: { id }, data: data as never });
    return this.toDomain(row);
  }

  async list(query: ListQCResultsQuery): Promise<{ results: QCResult[]; total: number }> {
    const where: Record<string, unknown> = {};
    if (query.status) where['status'] = query.status;
    if (query.alert) where['alert'] = query.alert;
    if (query.qcScheduleId) where['qcScheduleId'] = query.qcScheduleId;

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.qCResult.findMany({
        where,
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        orderBy: { performedDate: 'desc' },
      }),
      this.prisma.qCResult.count({ where }),
    ]);
    return { results: rows.map((r) => this.toDomain(r)), total };
  }

  private toDomain(row: {
    id: string; qcScheduleId: string | null; testId: string | null; testName: string;
    controlMaterialId: string | null; resultValue: string | null; performedDate: Date;
    performedBy: string | null; status: string; acceptableLimitLow: number;
    acceptableLimitHigh: number; warningLimitLow: number; warningLimitHigh: number;
    qualitativeObservation: string | null; alert: string; comments: string | null;
    createdAt: Date; updatedAt: Date;
  }): QCResult {
    return new QCResult(row.id, row.qcScheduleId, row.testId, row.testName,
      row.controlMaterialId, row.resultValue, row.performedDate, row.performedBy,
      row.status, row.acceptableLimitLow, row.acceptableLimitHigh,
      row.warningLimitLow, row.warningLimitHigh, row.qualitativeObservation,
      row.alert, row.comments, row.createdAt, row.updatedAt);
  }
}
