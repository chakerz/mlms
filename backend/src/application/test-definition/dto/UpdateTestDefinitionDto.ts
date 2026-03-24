import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum } from 'class-validator';
import { ContainerType } from '../../../domain/specimen/types/ContainerType';

export class UpdateTestDefinitionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nameFr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nameAr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  unit?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  referenceLow?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  referenceHigh?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ enum: ContainerType })
  @IsOptional()
  @IsEnum(ContainerType)
  tubeType?: ContainerType | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  minVolumeMl?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  fastingRequired?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  lightSensitive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxDelayMinutes?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  storageTemp?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  specialNotesFr?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  specialNotesAr?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  subcontracted?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  synonymes?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sampleTypeFr?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sampleTypeAr?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tubeFr?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tubeAr?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  method?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  collectionConditionFr?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  collectionConditionAr?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  preAnalyticDelay?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  preAnalyticDelayAr?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  turnaroundTime?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  turnaroundTimeAr?: string | null;
}
