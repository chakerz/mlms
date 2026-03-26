import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ISampleInventoryLineRepository, ListInventoryLinesQuery } from '../../../domain/sample/repositories/ISampleInventoryLineRepository';
import { SampleInventoryLine } from '../../../domain/sample/entities/SampleInventoryLine';

@Injectable()
export class SampleInventoryLinePrismaRepository implements ISampleInventoryLineRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<SampleInventoryLine | null> {
    const row = await this.prisma.sampleInventoryLine.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async save(line: SampleInventoryLine): Promise<SampleInventoryLine> {
    const row = await this.prisma.sampleInventoryLine.create({
      data: {
        barcode: line.barcode, inventoryCode: line.inventoryCode, sampleId: line.sampleId,
        receptionDate: line.receptionDate, receivedBy: line.receivedBy,
        currentLocation: line.currentLocation, currentStatus: line.currentStatus as never,
        quantity: line.quantity, unit: line.unit, collectionDate: line.collectionDate,
        collectionSite: line.collectionSite, collectedBy: line.collectedBy,
        qcPassed: line.qcPassed, qcNotes: line.qcNotes, conservationMethod: line.conservationMethod,
        expirationDate: line.expirationDate, history: (line.history as object) ?? undefined,
      },
    });
    return this.toDomain(row);
  }

  async update(id: string, data: Partial<SampleInventoryLine>): Promise<SampleInventoryLine> {
    const row = await this.prisma.sampleInventoryLine.update({ where: { id }, data: data as never });
    return this.toDomain(row);
  }

  async list(query: ListInventoryLinesQuery): Promise<{ lines: SampleInventoryLine[]; total: number }> {
    const where: Record<string, unknown> = {};
    if (query.sampleId) where['sampleId'] = query.sampleId;
    if (query.currentStatus) where['currentStatus'] = query.currentStatus;
    if (query.search) {
      where['OR'] = [
        { barcode: { contains: query.search, mode: 'insensitive' } },
        { inventoryCode: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.sampleInventoryLine.findMany({ where, skip: (query.page - 1) * query.pageSize, take: query.pageSize, orderBy: { receptionDate: 'desc' } }),
      this.prisma.sampleInventoryLine.count({ where }),
    ]);
    return { lines: rows.map((r) => this.toDomain(r)), total };
  }

  private toDomain(row: {
    id: string; barcode: string; inventoryCode: string; sampleId: string | null;
    receptionDate: Date; receivedBy: string | null; currentLocation: string | null;
    currentStatus: string; quantity: number; unit: string | null; collectionDate: Date | null;
    collectionSite: string | null; collectedBy: string | null; qcPassed: boolean;
    qcNotes: string | null; conservationMethod: string | null; expirationDate: Date | null;
    history: unknown; createdAt: Date; updatedAt: Date;
  }): SampleInventoryLine {
    return new SampleInventoryLine(row.id, row.barcode, row.inventoryCode, row.sampleId,
      row.receptionDate, row.receivedBy, row.currentLocation, row.currentStatus,
      row.quantity, row.unit, row.collectionDate, row.collectionSite, row.collectedBy,
      row.qcPassed, row.qcNotes, row.conservationMethod, row.expirationDate,
      row.history, row.createdAt, row.updatedAt);
  }
}
