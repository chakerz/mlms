import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ISampleRepository, ListSamplesQuery } from '../../../domain/sample/repositories/ISampleRepository';
import { Sample } from '../../../domain/sample/entities/Sample';

@Injectable()
export class SamplePrismaRepository implements ISampleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Sample | null> {
    const row = await this.prisma.sample.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async save(sample: Sample): Promise<Sample> {
    const row = await this.prisma.sample.create({
      data: {
        sampleCode: sample.sampleCode, name: sample.name, sampleType: sample.sampleType,
        sampleDescription: sample.sampleDescription, collectionMethod: sample.collectionMethod,
        containerType: sample.containerType, storageConditions: sample.storageConditions,
        handlingInstructions: sample.handlingInstructions, sampleStatus: sample.sampleStatus,
        qcPassed: sample.qcPassed, qcNotes: sample.qcNotes,
      },
    });
    return this.toDomain(row);
  }

  async update(id: string, data: Partial<Sample>): Promise<Sample> {
    const row = await this.prisma.sample.update({ where: { id }, data });
    return this.toDomain(row);
  }

  async list(query: ListSamplesQuery): Promise<{ samples: Sample[]; total: number }> {
    const where: Record<string, unknown> = {};
    if (query.search) {
      where['OR'] = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { sampleCode: { contains: query.search, mode: 'insensitive' } },
        { sampleType: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.sampleType) where['sampleType'] = { contains: query.sampleType, mode: 'insensitive' };

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.sample.findMany({ where, skip: (query.page - 1) * query.pageSize, take: query.pageSize, orderBy: { sampleCode: 'asc' } }),
      this.prisma.sample.count({ where }),
    ]);
    return { samples: rows.map((r) => this.toDomain(r)), total };
  }

  private toDomain(row: {
    id: string; sampleCode: string; name: string; sampleType: string;
    sampleDescription: string | null; collectionMethod: string | null; containerType: string | null;
    storageConditions: string | null; handlingInstructions: string | null; sampleStatus: string;
    qcPassed: boolean; qcNotes: string | null; createdAt: Date; updatedAt: Date;
  }): Sample {
    return new Sample(row.id, row.sampleCode, row.name, row.sampleType, row.sampleDescription,
      row.collectionMethod, row.containerType, row.storageConditions, row.handlingInstructions,
      row.sampleStatus, row.qcPassed, row.qcNotes, row.createdAt, row.updatedAt);
  }
}
