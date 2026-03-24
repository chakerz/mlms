import {
  IsString, IsNotEmpty, IsEnum, IsDateString,
  IsOptional, IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ResultFlag } from '../../../domain/result/types/ResultFlag';

export class RecordResultDto {
  @ApiProperty({ example: 'clxyz...' })
  @IsString()
  @IsNotEmpty()
  specimenId: string;

  @ApiProperty({ example: 'HGB' })
  @IsString()
  @IsNotEmpty()
  testCode: string;

  @ApiProperty({ example: 'Hémoglobine' })
  @IsString()
  @IsNotEmpty()
  testNameFr: string;

  @ApiProperty({ example: 'الهيموغلوبين' })
  @IsString()
  @IsNotEmpty()
  testNameAr: string;

  @ApiProperty({ example: '13.5' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiPropertyOptional({ example: 'g/dL' })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiPropertyOptional({ example: 12.0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  referenceLow?: number;

  @ApiPropertyOptional({ example: 16.0 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  referenceHigh?: number;

  @ApiProperty({ enum: ResultFlag })
  @IsEnum(ResultFlag)
  flag: ResultFlag;

  @ApiProperty({ example: '2026-03-16T10:00:00.000Z' })
  @IsDateString()
  measuredAt: string;
}
