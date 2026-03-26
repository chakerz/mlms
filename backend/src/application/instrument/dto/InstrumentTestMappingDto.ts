import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InstrumentTestMapping } from '../../../domain/instrument/entities/InstrumentTestMapping';

export class InstrumentTestMappingDto {
  id!: string;
  instrumentId!: string;
  internalTestCode!: string;
  instrumentTestCode!: string;
  sampleType!: string | null;
  specimenCode!: string | null;
  unit!: string | null;
  isActive!: boolean;
  createdAt!: string;
  updatedAt!: string;

  static from(e: InstrumentTestMapping): InstrumentTestMappingDto {
    const dto = new InstrumentTestMappingDto();
    Object.assign(dto, e);
    dto.createdAt = e.createdAt.toISOString();
    dto.updatedAt = e.updatedAt.toISOString();
    return dto;
  }
}

export class CreateInstrumentTestMappingDto {
  @ApiProperty() @IsString() internalTestCode!: string;
  @ApiProperty() @IsString() instrumentTestCode!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sampleType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() specimenCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() unit?: string;
}

export class UpdateInstrumentTestMappingDto {
  @ApiPropertyOptional() @IsOptional() @IsString() instrumentTestCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sampleType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() specimenCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() unit?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
}
