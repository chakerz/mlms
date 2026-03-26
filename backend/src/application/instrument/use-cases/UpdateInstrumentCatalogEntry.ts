import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';
import { InstrumentProtocolType, InstrumentTransportType, InstrumentDirectionMode } from '@prisma/client';

export interface UpdateInstrumentCatalogEntryDto {
  name?: string;
  manufacturer?: string;
  model?: string;
  category?: string;
  protocolType?: string;
  transportType?: string;
  directionMode?: string;
  defaultPort?: number | null;
  defaultBaudRate?: number | null;
  notes?: string | null;
}

@Injectable()
export class UpdateInstrumentCatalogEntry {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, dto: UpdateInstrumentCatalogEntryDto) {
    return this.prisma.instrumentCatalog.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.manufacturer !== undefined && { manufacturer: dto.manufacturer }),
        ...(dto.model !== undefined && { model: dto.model }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.protocolType !== undefined && { protocolType: dto.protocolType as InstrumentProtocolType }),
        ...(dto.transportType !== undefined && { transportType: dto.transportType as InstrumentTransportType }),
        ...(dto.directionMode !== undefined && { directionMode: dto.directionMode as InstrumentDirectionMode }),
        ...(dto.defaultPort !== undefined && { defaultPort: dto.defaultPort }),
        ...(dto.defaultBaudRate !== undefined && { defaultBaudRate: dto.defaultBaudRate }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
      },
    });
  }
}
