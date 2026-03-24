import { IsString, IsNotEmpty, IsInt, IsPositive, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReceiveReagentLotDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reagentId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lotNumber!: string;

  @ApiProperty()
  @IsDateString()
  expiryDate!: string;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  initialQuantity!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  storageLocation?: string;
}
