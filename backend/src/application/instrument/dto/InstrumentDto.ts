import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Instrument } from '../../../domain/instrument/entities/Instrument';

export class InstrumentDto {
  id!: string;
  code!: string;
  name!: string;
  manufacturer!: string | null;
  model!: string | null;
  protocolType!: string;
  transportType!: string;
  directionMode!: string;
  isActive!: boolean;
  location!: string | null;
  createdAt!: string;
  updatedAt!: string;

  static from(e: Instrument): InstrumentDto {
    const dto = new InstrumentDto();
    dto.id = e.id; dto.code = e.code; dto.name = e.name;
    dto.manufacturer = e.manufacturer; dto.model = e.model;
    dto.protocolType = e.protocolType; dto.transportType = e.transportType;
    dto.directionMode = e.directionMode; dto.isActive = e.isActive;
    dto.location = e.location;
    dto.createdAt = e.createdAt.toISOString(); dto.updatedAt = e.updatedAt.toISOString();
    return dto;
  }
}

export class CreateInstrumentDto {
  @ApiProperty() @IsString() code!: string;
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() manufacturer?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() model?: string;
  @ApiProperty() @IsString() protocolType!: string;
  @ApiProperty() @IsString() transportType!: string;
  @ApiProperty() @IsString() directionMode!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
}

export class UpdateInstrumentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() manufacturer?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() model?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() protocolType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() transportType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() directionMode?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
}
