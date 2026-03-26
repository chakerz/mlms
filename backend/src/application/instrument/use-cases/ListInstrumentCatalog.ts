import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';

export interface InstrumentCatalogItem {
  id: string;
  code: string;
  name: string;
  manufacturer: string;
  model: string;
  category: string | null;
  protocolType: string;
  transportType: string;
  directionMode: string;
  defaultPort: number | null;
  defaultBaudRate: number | null;
  notes: string | null;
}

@Injectable()
export class ListInstrumentCatalog {
  constructor(private readonly prisma: PrismaService) {}

  async execute(search?: string): Promise<InstrumentCatalogItem[]> {
    return this.prisma.instrumentCatalog.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { manufacturer: { contains: search, mode: 'insensitive' } },
              { model: { contains: search, mode: 'insensitive' } },
              { code: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: [{ manufacturer: 'asc' }, { name: 'asc' }],
    });
  }
}
