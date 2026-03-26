import { IsString, IsNotEmpty, IsOptional, IsNumber, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInvoiceLineDto {
  @ApiPropertyOptional({ example: 'clxxx...' })
  @IsString()
  @IsOptional()
  testOrderId?: string;

  @ApiProperty({ example: 'Numération Formule Sanguine' })
  @IsString()
  @IsNotEmpty()
  itemDescription: string;

  @ApiPropertyOptional({ default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @IsOptional()
  unitPrice?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @IsOptional()
  taxRate?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @IsOptional()
  discountPercentage?: number;

  @ApiPropertyOptional({ example: 'BIO-NFS' })
  @IsString()
  @IsOptional()
  billingCode?: string;
}
