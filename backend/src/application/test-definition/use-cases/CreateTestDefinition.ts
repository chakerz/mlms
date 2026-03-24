import { ConflictException } from '@nestjs/common';
import { TestDefinition } from '../../../domain/test-definition/entities/TestDefinition';
import { ITestDefinitionRepository } from '../../../domain/test-definition/repositories/ITestDefinitionRepository';
import { CreateTestDefinitionDto } from '../dto/CreateTestDefinitionDto';
import { TestDefinitionDto } from '../dto/TestDefinitionDto';

export class CreateTestDefinition {
  constructor(private readonly repo: ITestDefinitionRepository) {}

  async execute(dto: CreateTestDefinitionDto): Promise<TestDefinitionDto> {
    const existing = await this.repo.findByCode(dto.code);
    if (existing) {
      throw new ConflictException(`Test code '${dto.code}' already exists`);
    }

    const now = new Date();
    const def = new TestDefinition(
      '',
      dto.code.toUpperCase(),
      dto.nameFr,
      dto.nameAr,
      dto.category,
      dto.unit ?? null,
      dto.referenceLow ?? null,
      dto.referenceHigh ?? null,
      true,
      dto.tubeType ?? null,
      dto.minVolumeMl ?? null,
      dto.fastingRequired ?? false,
      dto.lightSensitive ?? false,
      dto.maxDelayMinutes ?? null,
      dto.storageTemp ?? null,
      dto.specialNotesFr ?? null,
      dto.specialNotesAr ?? null,
      dto.subcontracted ?? false,
      dto.synonymes ?? null,
      dto.sampleTypeFr ?? null,
      dto.sampleTypeAr ?? null,
      dto.tubeFr ?? null,
      dto.tubeAr ?? null,
      dto.method ?? null,
      dto.collectionConditionFr ?? null,
      dto.collectionConditionAr ?? null,
      dto.preAnalyticDelay ?? null,
      dto.preAnalyticDelayAr ?? null,
      dto.turnaroundTime ?? null,
      dto.turnaroundTimeAr ?? null,
      now,
      now,
    );

    const saved = await this.repo.save(def);
    return TestDefinitionDto.from(saved);
  }
}
