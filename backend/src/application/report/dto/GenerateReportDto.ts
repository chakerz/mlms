import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateReportDto {
  @ApiProperty({ description: 'Order ID to generate report for' })
  @IsString()
  orderId: string;

  @ApiPropertyOptional({ default: 'v1' })
  @IsOptional()
  @IsString()
  templateVersion?: string;
}
