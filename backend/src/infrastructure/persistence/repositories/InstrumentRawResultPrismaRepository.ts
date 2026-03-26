import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IInstrumentRawResultRepository, ListRawResultsQuery } from '../../../domain/instrument/repositories/IInstrumentRawResultRepository';
import { InstrumentRawResult } from '../../../domain/instrument/entities/InstrumentRawResult';

@Injectable()
export class InstrumentRawResultPrismaRepository implements IInstrumentRawResultRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<InstrumentRawResult | null> {
    const row = await this.prisma.instrumentRawResult.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async save(entity: InstrumentRawResult): Promise<InstrumentRawResult> {
    const row = await this.prisma.instrumentRawResult.create({
      data: {
        instrumentId: entity.instrumentId, specimenId: entity.specimenId, orderId: entity.orderId,
        internalTestCode: entity.internalTestCode, instrumentTestCode: entity.instrumentTestCode,
        resultValue: entity.resultValue, resultText: entity.resultText, unit: entity.unit,
        flagCode: entity.flagCode, deviceStatus: entity.deviceStatus,
        resultStatus: entity.resultStatus as any, measuredAt: entity.measuredAt,
        importedAt: entity.importedAt, rawMessageId: entity.rawMessageId,
      },
    });
    return this.toDomain(row);
  }

  async update(id: string, data: Partial<InstrumentRawResult>): Promise<InstrumentRawResult> {
    const row = await this.prisma.instrumentRawResult.update({ where: { id }, data: data as any });
    return this.toDomain(row);
  }

  async list(query: ListRawResultsQuery): Promise<{ results: InstrumentRawResult[]; total: number }> {
    const where: Record<string, unknown> = {};
    if (query.instrumentId) where['instrumentId'] = query.instrumentId;
    if (query.specimenId) where['specimenId'] = query.specimenId;
    if (query.resultStatus) where['resultStatus'] = query.resultStatus;

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.instrumentRawResult.findMany({ where, skip: (query.page - 1) * query.pageSize, take: query.pageSize, orderBy: { createdAt: 'desc' } }),
      this.prisma.instrumentRawResult.count({ where }),
    ]);
    return { results: rows.map((r) => this.toDomain(r)), total };
  }

  private toDomain(row: any): InstrumentRawResult {
    return new InstrumentRawResult(row.id, row.instrumentId, row.specimenId, row.orderId,
      row.internalTestCode, row.instrumentTestCode, row.resultValue, row.resultText,
      row.unit, row.flagCode, row.deviceStatus, row.resultStatus, row.measuredAt,
      row.importedAt, row.rawMessageId, row.createdAt, row.updatedAt);
  }
}
