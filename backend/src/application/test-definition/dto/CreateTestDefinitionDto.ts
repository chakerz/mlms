import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsEnum } from 'class-validator';
import { ContainerType } from '../../../domain/specimen/types/ContainerType';

export class CreateTestDefinitionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nameFr!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nameAr!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  referenceLow?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  referenceHigh?: number;

  @ApiPropertyOptional({ enum: ContainerType })
  @IsOptional()
  @IsEnum(ContainerType)
  tubeType?: ContainerType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  minVolumeMl?: number;

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
  maxDelayMinutes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  storageTemp?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  specialNotesFr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  specialNotesAr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  subcontracted?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  synonymes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sampleTypeFr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sampleTypeAr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tubeFr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tubeAr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  method?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  collectionConditionFr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  collectionConditionAr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  preAnalyticDelay?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  preAnalyticDelayAr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  turnaroundTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  turnaroundTimeAr?: string;
}
