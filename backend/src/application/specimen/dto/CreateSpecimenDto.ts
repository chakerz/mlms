import { IsString, IsNotEmpty, IsEnum, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SpecimenType } from '../../../domain/specimen/types/SpecimenType';
import { ContainerType } from '../../../domain/specimen/types/ContainerType';

export class CreateSpecimenDto {
  @ApiProperty({ example: 'clxyz001' })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiPropertyOptional({
    example: 'LAB-20260316-A1B2C3',
    description: 'Barcode unique. Auto-generated if omitted.',
  })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiProperty({ enum: SpecimenType })
  @IsEnum(SpecimenType)
  type: SpecimenType;

  @ApiPropertyOptional({ enum: ContainerType })
  @IsEnum(ContainerType)
  @IsOptional()
  containerType?: ContainerType;

  @ApiProperty({ example: '2026-03-16T10:00:00.000Z' })
  @IsDateString()
  collectionTime: string;

  @ApiPropertyOptional({ example: 'IDE. Karimi' })
  @IsString()
  @IsOptional()
  preleveur?: string;

  @ApiPropertyOptional({ example: '2026-03-16T10:30:00.000Z' })
  @IsDateString()
  @IsOptional()
  sentAt?: string;

  @ApiPropertyOptional({ example: 'Température ambiante' })
  @IsString()
  @IsOptional()
  transportConditions?: string;

  @ApiPropertyOptional({ example: '2026-03-16T18:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  conservedUntil?: string;

  @ApiPropertyOptional({ example: 'Réfrigérateur labo A' })
  @IsString()
  @IsOptional()
  conservationSite?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}
