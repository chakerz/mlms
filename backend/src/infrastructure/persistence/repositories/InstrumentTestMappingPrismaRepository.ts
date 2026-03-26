import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IInstrumentTestMappingRepository } from '../../../domain/instrument/repositories/IInstrumentTestMappingRepository';
import { InstrumentTestMapping } from '../../../domain/instrument/entities/InstrumentTestMapping';

@Injectable()
export class InstrumentTestMappingPrismaRepository implements IInstrumentTestMappingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<InstrumentTestMapping | null> {
    const row = await this.prisma.instrumentTestMapping.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async save(entity: InstrumentTestMapping): Promise<InstrumentTestMapping> {
    const row = await this.prisma.instrumentTestMapping.create({
      data: {
        instrumentId: entity.instrumentId, internalTestCode: entity.internalTestCode,
        instrumentTestCode: entity.instrumentTestCode, sampleType: entity.sampleType,
        specimenCode: entity.specimenCode, unit: entity.unit, isActive: entity.isActive,
      },
    });
    return this.toDomain(row);
  }

  async update(id: string, data: Partial<InstrumentTestMapping>): Promise<InstrumentTestMapping> {
    const row = await this.prisma.instrumentTestMapping.update({ where: { id }, data: data as any });
    return this.toDomain(row);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.instrumentTestMapping.delete({ where: { id } });
  }

  async listByInstrument(instrumentId: string): Promise<InstrumentTestMapping[]> {
    const rows = await this.prisma.instrumentTestMapping.findMany({
      where: { instrumentId }, orderBy: { internalTestCode: 'asc' },
    });
    return rows.map((r) => this.toDomain(r));
  }

  private toDomain(row: any): InstrumentTestMapping {
    return new InstrumentTestMapping(row.id, row.instrumentId, row.internalTestCode,
      row.instrumentTestCode, row.sampleType, row.specimenCode, row.unit,
      row.isActive, row.createdAt, row.updatedAt);
  }
}
