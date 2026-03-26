import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IInstrumentOrderOutboxRepository, ListOutboxQuery } from '../../../domain/instrument/repositories/IInstrumentOrderOutboxRepository';
import { InstrumentOrderOutbox } from '../../../domain/instrument/entities/InstrumentOrderOutbox';

@Injectable()
export class InstrumentOrderOutboxPrismaRepository implements IInstrumentOrderOutboxRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<InstrumentOrderOutbox | null> {
    const row = await this.prisma.instrumentOrderOutbox.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async save(entity: InstrumentOrderOutbox): Promise<InstrumentOrderOutbox> {
    const row = await this.prisma.instrumentOrderOutbox.create({
      data: {
        instrumentId: entity.instrumentId, specimenId: entity.specimenId,
        orderId: entity.orderId, messageType: entity.messageType,
        payloadJson: entity.payloadJson as any, rawPayload: entity.rawPayload,
        status: entity.status as any, retryCount: entity.retryCount,
      },
    });
    return this.toDomain(row);
  }

  async update(id: string, data: Partial<InstrumentOrderOutbox>): Promise<InstrumentOrderOutbox> {
    const row = await this.prisma.instrumentOrderOutbox.update({ where: { id }, data: data as any });
    return this.toDomain(row);
  }

  async list(query: ListOutboxQuery): Promise<{ messages: InstrumentOrderOutbox[]; total: number }> {
    const where: Record<string, unknown> = {};
    if (query.instrumentId) where['instrumentId'] = query.instrumentId;
    if (query.status) where['status'] = query.status;

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.instrumentOrderOutbox.findMany({ where, skip: (query.page - 1) * query.pageSize, take: query.pageSize, orderBy: { createdAt: 'desc' } }),
      this.prisma.instrumentOrderOutbox.count({ where }),
    ]);
    return { messages: rows.map((r) => this.toDomain(r)), total };
  }

  private toDomain(row: any): InstrumentOrderOutbox {
    return new InstrumentOrderOutbox(row.id, row.instrumentId, row.specimenId, row.orderId,
      row.messageType, row.payloadJson, row.rawPayload, row.status, row.retryCount,
      row.sentAt, row.ackReceivedAt, row.errorMessage, row.createdAt, row.updatedAt);
  }
}
