import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { InstrumentConnection } from '../../../domain/instrument/entities/InstrumentConnection';

export class InstrumentConnectionDto {
  id!: string;
  instrumentId!: string;
  host!: string | null;
  port!: number | null;
  serialPort!: string | null;
  baudRate!: number | null;
  parity!: string | null;
  dataBits!: number | null;
  stopBits!: number | null;
  fileImportPath!: string | null;
  fileExportPath!: string | null;
  ackEnabled!: boolean;
  encoding!: string | null;
  timeoutMs!: number | null;
  retryLimit!: number;
  createdAt!: string;
  updatedAt!: string;

  static from(e: InstrumentConnection): InstrumentConnectionDto {
    const dto = new InstrumentConnectionDto();
    Object.assign(dto, e);
    dto.createdAt = e.createdAt.toISOString();
    dto.updatedAt = e.updatedAt.toISOString();
    return dto;
  }
}

export class UpsertInstrumentConnectionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() host?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() port?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() serialPort?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() baudRate?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() parity?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() dataBits?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() stopBits?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() fileImportPath?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fileExportPath?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() ackEnabled?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() encoding?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() timeoutMs?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() retryLimit?: number;
}
