import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TestDefinition } from '../../../domain/test-definition/entities/TestDefinition';

export class TestDefinitionDto {
  @ApiProperty() id!: string;
  @ApiProperty() code!: string;
  @ApiProperty() nameFr!: string;
  @ApiProperty() nameAr!: string;
  @ApiProperty() category!: string;
  @ApiPropertyOptional() unit!: string | null;
  @ApiPropertyOptional() referenceLow!: number | null;
  @ApiPropertyOptional() referenceHigh!: number | null;
  @ApiProperty() isActive!: boolean;
  @ApiPropertyOptional() tubeType!: string | null;
  @ApiPropertyOptional() minVolumeMl!: number | null;
  @ApiProperty() fastingRequired!: boolean;
  @ApiProperty() lightSensitive!: boolean;
  @ApiPropertyOptional() maxDelayMinutes!: number | null;
  @ApiPropertyOptional() storageTemp!: string | null;
  @ApiPropertyOptional() specialNotesFr!: string | null;
  @ApiPropertyOptional() specialNotesAr!: string | null;
  @ApiProperty() subcontracted!: boolean;
  // Catalogue bilingue
  @ApiPropertyOptional() synonymes!: string | null;
  @ApiPropertyOptional() sampleTypeFr!: string | null;
  @ApiPropertyOptional() sampleTypeAr!: string | null;
  @ApiPropertyOptional() tubeFr!: string | null;
  @ApiPropertyOptional() tubeAr!: string | null;
  @ApiPropertyOptional() method!: string | null;
  @ApiPropertyOptional() collectionConditionFr!: string | null;
  @ApiPropertyOptional() collectionConditionAr!: string | null;
  @ApiPropertyOptional() preAnalyticDelay!: string | null;
  @ApiPropertyOptional() preAnalyticDelayAr!: string | null;
  @ApiPropertyOptional() turnaroundTime!: string | null;
  @ApiPropertyOptional() turnaroundTimeAr!: string | null;
  @ApiProperty() createdAt!: string;
  @ApiProperty() updatedAt!: string;

  static from(d: TestDefinition): TestDefinitionDto {
    const dto = new TestDefinitionDto();
    dto.id = d.id;
    dto.code = d.code;
    dto.nameFr = d.nameFr;
    dto.nameAr = d.nameAr;
    dto.category = d.category;
    dto.unit = d.unit;
    dto.referenceLow = d.referenceLow;
    dto.referenceHigh = d.referenceHigh;
    dto.isActive = d.isActive;
    dto.tubeType = d.tubeType;
    dto.minVolumeMl = d.minVolumeMl;
    dto.fastingRequired = d.fastingRequired;
    dto.lightSensitive = d.lightSensitive;
    dto.maxDelayMinutes = d.maxDelayMinutes;
    dto.storageTemp = d.storageTemp;
    dto.specialNotesFr = d.specialNotesFr;
    dto.specialNotesAr = d.specialNotesAr;
    dto.subcontracted = d.subcontracted;
    dto.synonymes = d.synonymes;
    dto.sampleTypeFr = d.sampleTypeFr;
    dto.sampleTypeAr = d.sampleTypeAr;
    dto.tubeFr = d.tubeFr;
    dto.tubeAr = d.tubeAr;
    dto.method = d.method;
    dto.collectionConditionFr = d.collectionConditionFr;
    dto.collectionConditionAr = d.collectionConditionAr;
    dto.preAnalyticDelay = d.preAnalyticDelay;
    dto.preAnalyticDelayAr = d.preAnalyticDelayAr;
    dto.turnaroundTime = d.turnaroundTime;
    dto.turnaroundTimeAr = d.turnaroundTimeAr;
    dto.createdAt = d.createdAt.toISOString();
    dto.updatedAt = d.updatedAt.toISOString();
    return dto;
  }
}

export class PaginatedTestDefinitionsDto {
  @ApiProperty({ type: [TestDefinitionDto] }) data!: TestDefinitionDto[];
  @ApiProperty() total!: number;
  @ApiProperty() page!: number;
  @ApiProperty() pageSize!: number;
}
