import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IInstrumentRepository, ListInstrumentsQuery } from '../../../domain/instrument/repositories/IInstrumentRepository';
import { Instrument } from '../../../domain/instrument/entities/Instrument';

@Injectable()
export class InstrumentPrismaRepository implements IInstrumentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Instrument | null> {
    const row = await this.prisma.instrument.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async save(entity: Instrument): Promise<Instrument> {
    const row = await this.prisma.instrument.create({
      data: {
        code: entity.code, name: entity.name, manufacturer: entity.manufacturer,
        model: entity.model, protocolType: entity.protocolType as any,
        transportType: entity.transportType as any, directionMode: entity.directionMode as any,
        isActive: entity.isActive, location: entity.location,
      },
    });
    return this.toDomain(row);
  }

  async update(id: string, data: Partial<Instrument>): Promise<Instrument> {
    const row = await this.prisma.instrument.update({ where: { id }, data: data as any });
    return this.toDomain(row);
  }

  async list(query: ListInstrumentsQuery): Promise<{ instruments: Instrument[]; total: number }> {
    const where: Record<string, unknown> = {};
    if (query.search) {
      where['OR'] = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { code: { contains: query.search, mode: 'insensitive' } },
        { manufacturer: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.isActive !== undefined) where['isActive'] = query.isActive;

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.instrument.findMany({ where, skip: (query.page - 1) * query.pageSize, take: query.pageSize, orderBy: { name: 'asc' } }),
      this.prisma.instrument.count({ where }),
    ]);
    return { instruments: rows.map((r) => this.toDomain(r)), total };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.instrument.delete({ where: { id } });
  }

  private toDomain(row: any): Instrument {
    return new Instrument(row.id, row.code, row.name, row.manufacturer, row.model,
      row.protocolType, row.transportType, row.directionMode, row.isActive,
      row.location, row.createdAt, row.updatedAt);
  }
}
