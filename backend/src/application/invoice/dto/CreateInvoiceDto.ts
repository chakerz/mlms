import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateInvoiceLineDto } from './CreateInvoiceLineDto';

export class CreateInvoiceDto {
  @ApiPropertyOptional({ example: 'clxxx...' })
  @IsString()
  @IsOptional()
  orderId?: string;

  @ApiPropertyOptional({ example: 'clxxx...' })
  @IsString()
  @IsOptional()
  patientId?: string;

  @ApiPropertyOptional({ example: 'clxxx...' })
  @IsString()
  @IsOptional()
  practitionerId?: string;

  @ApiProperty({ example: 'Youssef Benali' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiPropertyOptional({ example: '12 Rue Ibn Battouta, Casablanca' })
  @IsString()
  @IsOptional()
  customerAddress?: string;

  @ApiPropertyOptional({ example: 'patient@email.ma' })
  @IsString()
  @IsOptional()
  customerEmail?: string;

  @ApiPropertyOptional({ example: '+212661234567' })
  @IsString()
  @IsOptional()
  customerPhone?: string;

  @ApiPropertyOptional({ example: '2026-03-24T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  invoiceDate?: string;

  @ApiPropertyOptional({ example: '2026-04-24T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiPropertyOptional({ example: '30 jours' })
  @IsString()
  @IsOptional()
  paymentTerms?: string;

  @ApiPropertyOptional({ example: 'BIO-001,BIO-002' })
  @IsString()
  @IsOptional()
  billingCodes?: string;

  @ApiPropertyOptional({ example: 'Commentaire sur la facture' })
  @IsString()
  @IsOptional()
  comments?: string;

  @ApiProperty({ type: [CreateInvoiceLineDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceLineDto)
  lines: CreateInvoiceLineDto[];
}
