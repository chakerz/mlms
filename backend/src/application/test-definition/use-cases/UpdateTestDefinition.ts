import { NotFoundException } from '@nestjs/common';
import { TestDefinition } from '../../../domain/test-definition/entities/TestDefinition';
import { ITestDefinitionRepository } from '../../../domain/test-definition/repositories/ITestDefinitionRepository';
import { UpdateTestDefinitionDto } from '../dto/UpdateTestDefinitionDto';
import { TestDefinitionDto } from '../dto/TestDefinitionDto';

export class UpdateTestDefinition {
  constructor(private readonly repo: ITestDefinitionRepository) {}

  async execute(id: string, dto: UpdateTestDefinitionDto): Promise<TestDefinitionDto> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException(`TestDefinition ${id} not found`);
    }

    const updated = new TestDefinition(
      existing.id,
      existing.code,
      dto.nameFr ?? existing.nameFr,
      dto.nameAr ?? existing.nameAr,
      dto.category ?? existing.category,
      dto.unit !== undefined ? (dto.unit ?? null) : existing.unit,
      dto.referenceLow !== undefined ? dto.referenceLow : existing.referenceLow,
      dto.referenceHigh !== undefined ? dto.referenceHigh : existing.referenceHigh,
      dto.isActive !== undefined ? dto.isActive : existing.isActive,
      dto.tubeType !== undefined ? (dto.tubeType ?? null) : existing.tubeType,
      dto.minVolumeMl !== undefined ? dto.minVolumeMl : existing.minVolumeMl,
      dto.fastingRequired !== undefined ? dto.fastingRequired : existing.fastingRequired,
      dto.lightSensitive !== undefined ? dto.lightSensitive : existing.lightSensitive,
      dto.maxDelayMinutes !== undefined ? dto.maxDelayMinutes : existing.maxDelayMinutes,
      dto.storageTemp !== undefined ? (dto.storageTemp ?? null) : existing.storageTemp,
      dto.specialNotesFr !== undefined ? (dto.specialNotesFr ?? null) : existing.specialNotesFr,
      dto.specialNotesAr !== undefined ? (dto.specialNotesAr ?? null) : existing.specialNotesAr,
      dto.subcontracted !== undefined ? dto.subcontracted : existing.subcontracted,
      dto.synonymes !== undefined ? (dto.synonymes ?? null) : existing.synonymes,
      dto.sampleTypeFr !== undefined ? (dto.sampleTypeFr ?? null) : existing.sampleTypeFr,
      dto.sampleTypeAr !== undefined ? (dto.sampleTypeAr ?? null) : existing.sampleTypeAr,
      dto.tubeFr !== undefined ? (dto.tubeFr ?? null) : existing.tubeFr,
      dto.tubeAr !== undefined ? (dto.tubeAr ?? null) : existing.tubeAr,
      dto.method !== undefined ? (dto.method ?? null) : existing.method,
      dto.collectionConditionFr !== undefined ? (dto.collectionConditionFr ?? null) : existing.collectionConditionFr,
      dto.collectionConditionAr !== undefined ? (dto.collectionConditionAr ?? null) : existing.collectionConditionAr,
      dto.preAnalyticDelay !== undefined ? (dto.preAnalyticDelay ?? null) : existing.preAnalyticDelay,
      dto.preAnalyticDelayAr !== undefined ? (dto.preAnalyticDelayAr ?? null) : existing.preAnalyticDelayAr,
      dto.turnaroundTime !== undefined ? (dto.turnaroundTime ?? null) : existing.turnaroundTime,
      dto.turnaroundTimeAr !== undefined ? (dto.turnaroundTimeAr ?? null) : existing.turnaroundTimeAr,
      existing.createdAt,
      new Date(),
    );

    const saved = await this.repo.save(updated);
    return TestDefinitionDto.from(saved);
  }
}
