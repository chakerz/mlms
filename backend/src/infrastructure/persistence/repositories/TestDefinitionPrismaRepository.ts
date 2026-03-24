import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TestDefinition } from '../../../domain/test-definition/entities/TestDefinition';
import {
  ITestDefinitionRepository,
  ListTestDefinitionsQuery,
  PaginatedTestDefinitions,
} from '../../../domain/test-definition/repositories/ITestDefinitionRepository';

@Injectable()
export class TestDefinitionPrismaRepository implements ITestDefinitionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<TestDefinition | null> {
    const row = await this.prisma.testDefinition.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByCode(code: string): Promise<TestDefinition | null> {
    const row = await this.prisma.testDefinition.findUnique({ where: { code } });
    return row ? this.toDomain(row) : null;
  }

  async save(def: TestDefinition): Promise<TestDefinition> {
    const catalogueFields = {
      synonymes: def.synonymes,
      sampleTypeFr: def.sampleTypeFr,
      sampleTypeAr: def.sampleTypeAr,
      tubeFr: def.tubeFr,
      tubeAr: def.tubeAr,
      method: def.method,
      collectionConditionFr: def.collectionConditionFr,
      collectionConditionAr: def.collectionConditionAr,
      preAnalyticDelay: def.preAnalyticDelay,
      preAnalyticDelayAr: def.preAnalyticDelayAr,
      turnaroundTime: def.turnaroundTime,
      turnaroundTimeAr: def.turnaroundTimeAr,
    };

    if (def.id) {
      const row = await this.prisma.testDefinition.update({
        where: { id: def.id },
        data: {
          nameFr: def.nameFr,
          nameAr: def.nameAr,
          category: def.category,
          unit: def.unit,
          referenceLow: def.referenceLow,
          referenceHigh: def.referenceHigh,
          isActive: def.isActive,
          tubeType: def.tubeType as unknown as import('@prisma/client').ContainerType | null,
          minVolumeMl: def.minVolumeMl,
          fastingRequired: def.fastingRequired,
          lightSensitive: def.lightSensitive,
          maxDelayMinutes: def.maxDelayMinutes,
          storageTemp: def.storageTemp,
          specialNotesFr: def.specialNotesFr,
          specialNotesAr: def.specialNotesAr,
          subcontracted: def.subcontracted,
          ...catalogueFields,
        },
      });
      return this.toDomain(row);
    }

    const row = await this.prisma.testDefinition.create({
      data: {
        code: def.code,
        nameFr: def.nameFr,
        nameAr: def.nameAr,
        category: def.category,
        unit: def.unit,
        referenceLow: def.referenceLow,
        referenceHigh: def.referenceHigh,
        isActive: def.isActive,
        tubeType: def.tubeType as unknown as import('@prisma/client').ContainerType | null,
        minVolumeMl: def.minVolumeMl,
        fastingRequired: def.fastingRequired,
        lightSensitive: def.lightSensitive,
        maxDelayMinutes: def.maxDelayMinutes,
        storageTemp: def.storageTemp,
        specialNotesFr: def.specialNotesFr,
        specialNotesAr: def.specialNotesAr,
        subcontracted: def.subcontracted,
        ...catalogueFields,
      },
    });
    return this.toDomain(row);
  }

  async list(query: ListTestDefinitionsQuery): Promise<PaginatedTestDefinitions> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};
    if (query.category) where['category'] = query.category;
    if (query.activeOnly) where['isActive'] = true;
    if (query.search) {
      where['OR'] = [
        { nameFr: { contains: query.search, mode: 'insensitive' } },
        { nameAr: { contains: query.search } },
        { code: { contains: query.search, mode: 'insensitive' } },
        { synonymes: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.testDefinition.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ category: 'asc' }, { nameFr: 'asc' }],
      }),
      this.prisma.testDefinition.count({ where }),
    ]);

    return {
      data: rows.map((r) => this.toDomain(r)),
      total,
      page,
      pageSize,
    };
  }

  private toDomain(row: {
    id: string;
    code: string;
    nameFr: string;
    nameAr: string;
    category: string;
    unit: string | null;
    referenceLow: number | null;
    referenceHigh: number | null;
    isActive: boolean;
    tubeType: string | null;
    minVolumeMl: number | null;
    fastingRequired: boolean;
    lightSensitive: boolean;
    maxDelayMinutes: number | null;
    storageTemp: string | null;
    specialNotesFr: string | null;
    specialNotesAr: string | null;
    subcontracted: boolean;
    synonymes: string | null;
    sampleTypeFr: string | null;
    sampleTypeAr: string | null;
    tubeFr: string | null;
    tubeAr: string | null;
    method: string | null;
    collectionConditionFr: string | null;
    collectionConditionAr: string | null;
    preAnalyticDelay: string | null;
    preAnalyticDelayAr: string | null;
    turnaroundTime: string | null;
    turnaroundTimeAr: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): TestDefinition {
    return new TestDefinition(
      row.id,
      row.code,
      row.nameFr,
      row.nameAr,
      row.category,
      row.unit,
      row.referenceLow,
      row.referenceHigh,
      row.isActive,
      row.tubeType as import('../../../domain/specimen/types/ContainerType').ContainerType | null,
      row.minVolumeMl,
      row.fastingRequired,
      row.lightSensitive,
      row.maxDelayMinutes,
      row.storageTemp,
      row.specialNotesFr,
      row.specialNotesAr,
      row.subcontracted,
      row.synonymes,
      row.sampleTypeFr,
      row.sampleTypeAr,
      row.tubeFr,
      row.tubeAr,
      row.method,
      row.collectionConditionFr,
      row.collectionConditionAr,
      row.preAnalyticDelay,
      row.preAnalyticDelayAr,
      row.turnaroundTime,
      row.turnaroundTimeAr,
      row.createdAt,
      row.updatedAt,
    );
  }
}
