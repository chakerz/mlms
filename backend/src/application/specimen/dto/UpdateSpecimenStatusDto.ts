import { IsEnum, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SpecimenStatus } from '../../../domain/specimen/types/SpecimenStatus';

export class UpdateSpecimenStatusDto {
  @ApiProperty({ enum: SpecimenStatus })
  @IsEnum(SpecimenStatus)
  status: SpecimenStatus;

  @ApiPropertyOptional({
    example: '2026-03-16T11:00:00.000Z',
    description: 'Set when transitioning to RECEIVED.',
  })
  @IsDateString()
  @IsOptional()
  receivedAt?: string;
}
