import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class GetSimulatorConfig {
  constructor(private prisma: PrismaService) {}

  async execute(instrumentId: string) {
    const config = await this.prisma.instrumentSimulatorConfig.findUnique({
      where: { instrumentId },
    });

    // Return defaults if not configured yet
    if (!config) {
      return {
        instrumentId,
        rackCount: 1,
        slotsPerRack: 20,
        statSlots: 3,
        throughputPerHour: 100,
        processingTimeMinMs: 4000,
        processingTimeMaxMs: 10000,
        abnormalRate: 0.12,
        errorRate: 0.02,
        calibrationIntervalMs: 1800000,
      };
    }

    return config;
  }
}
