import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NonConformiteReason } from '../../../domain/non-conformite/types/NonConformiteReason';
import { ConformiteAction } from '../../../domain/non-conformite/types/ConformiteAction';

export class CreateNonConformiteDto {
  @ApiPropertyOptional({ example: 'clxyz001' })
  @IsString()
  @IsOptional()
  specimenId?: string;

  @ApiPropertyOptional({ example: 'clxyz002' })
  @IsString()
  @IsOptional()
  orderId?: string;

  @ApiProperty({ enum: NonConformiteReason })
  @IsEnum(NonConformiteReason)
  reason: NonConformiteReason;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  details?: string;

  @ApiProperty({ enum: ConformiteAction })
  @IsEnum(ConformiteAction)
  action: ConformiteAction;
}
