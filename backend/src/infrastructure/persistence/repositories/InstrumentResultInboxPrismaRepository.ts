import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IInstrumentResultInboxRepository, ListInboxQuery } from '../../../domain/instrument/repositories/IInstrumentResultInboxRepository';
import { InstrumentResultInbox } from '../../../domain/instrument/entities/InstrumentResultInbox';

@Injectable()
export class InstrumentResultInboxPrismaRepository implements IInstrumentResultInboxRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<InstrumentResultInbox | null> {
    const row = await this.prisma.instrumentResultInbox.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async save(entity: InstrumentResultInbox): Promise<InstrumentResultInbox> {
    const row = await this.prisma.instrumentResultInbox.create({
      data: {
        instrumentId: entity.instrumentId, messageType: entity.messageType,
        rawPayload: entity.rawPayload, parsedPayloadJson: entity.parsedPayloadJson as any,
        sampleId: entity.sampleId, barcode: entity.barcode,
        matchingStatus: entity.matchingStatus as any, importStatus: entity.importStatus as any,
        receivedAt: entity.receivedAt,
      },
    });
    return this.toDomain(row);
  }

  async update(id: string, data: Partial<InstrumentResultInbox>): Promise<InstrumentResultInbox> {
    const row = await this.prisma.instrumentResultInbox.update({ where: { id }, data: data as any });
    return this.toDomain(row);
  }

  async list(query: ListInboxQuery): Promise<{ messages: InstrumentResultInbox[]; total: number }> {
    const where: Record<string, unknown> = {};
    if (query.instrumentId) where['instrumentId'] = query.instrumentId;
    if (query.importStatus) where['importStatus'] = query.importStatus;
    if (query.matchingStatus) where['matchingStatus'] = query.matchingStatus;

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.instrumentResultInbox.findMany({ where, skip: (query.page - 1) * query.pageSize, take: query.pageSize, orderBy: { receivedAt: 'desc' } }),
      this.prisma.instrumentResultInbox.count({ where }),
    ]);
    return { messages: rows.map((r) => this.toDomain(r)), total };
  }

  private toDomain(row: any): InstrumentResultInbox {
    return new InstrumentResultInbox(row.id, row.instrumentId, row.messageType, row.rawPayload,
      row.parsedPayloadJson, row.sampleId, row.barcode, row.matchingStatus, row.importStatus,
      row.receivedAt, row.processedAt, row.errorMessage, row.createdAt, row.updatedAt);
  }
}
