import { IsString, IsEnum, IsDateString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ResultFlag } from '../../../domain/result/types/ResultFlag';

export class UpdateResultDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  value?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  unit?: string | null;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  referenceLow?: number | null;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  referenceHigh?: number | null;

  @ApiPropertyOptional({ enum: ResultFlag })
  @IsEnum(ResultFlag)
  @IsOptional()
  flag?: ResultFlag;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  measuredAt?: string;
}
