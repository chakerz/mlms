import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  IResultRepository,
  UpdateResultData,
} from '../../../domain/result/repositories/IResultRepository';
import { Result } from '../../../domain/result/entities/Result';
import { ResultFlag } from '../../../domain/result/types/ResultFlag';

type PrismaResultRow = {
  id: string;
  specimenId: string;
  testCode: string;
  testNameFr: string;
  testNameAr: string;
  value: string;
  unit: string | null;
  referenceLow: number | null;
  referenceHigh: number | null;
  flag: string;
  measuredAt: Date;
  measuredBy: string | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class ResultPrismaRepository implements IResultRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Result | null> {
    const row = await this.prisma.result.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findBySpecimenIdAndTestCode(
    specimenId: string,
    testCode: string,
  ): Promise<Result | null> {
    const row = await this.prisma.result.findUnique({
      where: { specimenId_testCode: { specimenId, testCode } },
    });
    return row ? this.toDomain(row) : null;
  }

  async findBySpecimenId(specimenId: string): Promise<Result[]> {
    const rows = await this.prisma.result.findMany({
      where: { specimenId },
      orderBy: { measuredAt: 'asc' },
    });
    return rows.map((r) => this.toDomain(r));
  }

  async findByOrderId(orderId: string): Promise<Result[]> {
    const rows = await this.prisma.result.findMany({
      where: { specimen: { orderId } },
      orderBy: { measuredAt: 'asc' },
    });
    return rows.map((r) => this.toDomain(r));
  }

  async save(result: Result): Promise<Result> {
    const row = await this.prisma.result.create({
      data: {
        specimenId: result.specimenId,
        testCode: result.testCode,
        testNameFr: result.testNameFr,
        testNameAr: result.testNameAr,
        value: result.value,
        unit: result.unit,
        referenceLow: result.referenceLow,
        referenceHigh: result.referenceHigh,
        flag: result.flag as unknown as import('@prisma/client').ResultFlag,
        measuredAt: result.measuredAt,
        measuredBy: result.measuredBy,
      },
    });
    return this.toDomain(row);
  }

  async update(id: string, data: UpdateResultData): Promise<Result> {
    const patch: Record<string, unknown> = {};
    if (data.value !== undefined) patch['value'] = data.value;
    if (data.unit !== undefined) patch['unit'] = data.unit;
    if (data.referenceLow !== undefined) patch['referenceLow'] = data.referenceLow;
    if (data.referenceHigh !== undefined) patch['referenceHigh'] = data.referenceHigh;
    if (data.flag !== undefined) {
      patch['flag'] = data.flag as unknown as import('@prisma/client').ResultFlag;
    }
    if (data.measuredAt !== undefined) patch['measuredAt'] = data.measuredAt;

    const row = await this.prisma.result.update({ where: { id }, data: patch });
    return this.toDomain(row);
  }

  private toDomain(row: PrismaResultRow): Result {
    return new Result(
      row.id,
      row.specimenId,
      row.testCode,
      row.testNameFr,
      row.testNameAr,
      row.value,
      row.unit,
      row.referenceLow,
      row.referenceHigh,
      row.flag as ResultFlag,
      row.measuredAt,
      row.measuredBy,
      row.createdAt,
      row.updatedAt,
    );
  }
}
