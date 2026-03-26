import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';

export interface UpsertSimulatorConfigDto {
  rackCount?: number;
  slotsPerRack?: number;
  statSlots?: number;
  throughputPerHour?: number;
  processingTimeMinMs?: number;
  processingTimeMaxMs?: number;
  abnormalRate?: number;
  errorRate?: number;
  calibrationIntervalMs?: number;
}

@Injectable()
export class UpsertSimulatorConfig {
  constructor(private prisma: PrismaService) {}

  async execute(instrumentId: string, dto: UpsertSimulatorConfigDto) {
    const instrument = await this.prisma.instrument.findUnique({ where: { id: instrumentId } });
    if (!instrument) throw new NotFoundException('Instrument not found');

    return this.prisma.instrumentSimulatorConfig.upsert({
      where: { instrumentId },
      create: { instrumentId, ...dto },
      update: { ...dto },
    });
  }
}
