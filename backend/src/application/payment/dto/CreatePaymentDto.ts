import { IsString, IsOptional, IsNumber, IsEnum, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '../../../domain/payment/types/PaymentMethod';

export class CreatePaymentDto {
  @ApiPropertyOptional({ example: 'clxxx...' })
  @IsString()
  @IsOptional()
  invoiceId?: string;

  @ApiPropertyOptional({ example: 'clxxx...' })
  @IsString()
  @IsOptional()
  patientId?: string;

  @ApiPropertyOptional({ example: 'Youssef Benali' })
  @IsString()
  @IsOptional()
  patientName?: string;

  @ApiProperty({ example: 1500.0 })
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiProperty({ example: 1500.0 })
  @IsNumber()
  @Min(0)
  amountPaid: number;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({ example: '2026-03-24T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  paymentDate?: string;

  @ApiPropertyOptional({ example: 'Paiement reçu en espèces' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  totalAmountInWordsFr?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  totalAmountInWordsEn?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  amountPaidInWordsFr?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  amountPaidInWordsEn?: string;
}
