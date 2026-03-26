import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IInstrumentConnectionRepository } from '../../../domain/instrument/repositories/IInstrumentConnectionRepository';
import { InstrumentConnection } from '../../../domain/instrument/entities/InstrumentConnection';

@Injectable()
export class InstrumentConnectionPrismaRepository implements IInstrumentConnectionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByInstrumentId(instrumentId: string): Promise<InstrumentConnection | null> {
    const row = await this.prisma.instrumentConnection.findUnique({ where: { instrumentId } });
    return row ? this.toDomain(row) : null;
  }

  async upsert(instrumentId: string, data: Partial<InstrumentConnection>): Promise<InstrumentConnection> {
    const row = await this.prisma.instrumentConnection.upsert({
      where: { instrumentId },
      update: data as any,
      create: { instrumentId, ...data as any },
    });
    return this.toDomain(row);
  }

  private toDomain(row: any): InstrumentConnection {
    return new InstrumentConnection(row.id, row.instrumentId, row.host, row.port,
      row.serialPort, row.baudRate, row.parity, row.dataBits, row.stopBits,
      row.fileImportPath, row.fileExportPath, row.ackEnabled, row.encoding,
      row.timeoutMs, row.retryLimit, row.createdAt, row.updatedAt);
  }
}
