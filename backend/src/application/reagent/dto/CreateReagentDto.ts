import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReagentCategory } from '../../../domain/reagent/types/ReagentCategory';

export class CreateReagentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  manufacturer!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  catalogNumber?: string;

  @ApiProperty({ enum: ReagentCategory })
  @IsEnum(ReagentCategory)
  category!: ReagentCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  storageTemp?: string;
}
