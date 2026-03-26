import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';
import { InstrumentProtocolType, InstrumentTransportType, InstrumentDirectionMode } from '@prisma/client';

export interface CreateInstrumentCatalogEntryDto {
  code: string;
  name: string;
  manufacturer: string;
  model: string;
  category?: string;
  protocolType: string;
  transportType: string;
  directionMode: string;
  defaultPort?: number;
  defaultBaudRate?: number;
  notes?: string;
}

@Injectable()
export class CreateInstrumentCatalogEntry {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: CreateInstrumentCatalogEntryDto) {
    return this.prisma.instrumentCatalog.create({
      data: {
        code: dto.code,
        name: dto.name,
        manufacturer: dto.manufacturer,
        model: dto.model,
        category: dto.category ?? null,
        protocolType: dto.protocolType as InstrumentProtocolType,
        transportType: dto.transportType as InstrumentTransportType,
        directionMode: dto.directionMode as InstrumentDirectionMode,
        defaultPort: dto.defaultPort ?? null,
        defaultBaudRate: dto.defaultBaudRate ?? null,
        notes: dto.notes ?? null,
      },
    });
  }
}
