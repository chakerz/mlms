import { IsString, IsNotEmpty, IsEnum, IsArray, ArrayMinSize, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderPriority } from '../../../domain/order/types/OrderPriority';
import { PrescriptorType } from '../../../domain/order/types/PrescriptorType';
import { CreateTestOrderItemDto } from './CreateTestOrderItemDto';

export class CreateOrderDto {
  @ApiProperty({ example: 'clxxx...' })
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({ enum: OrderPriority, default: OrderPriority.ROUTINE })
  @IsEnum(OrderPriority)
  priority: OrderPriority;

  @ApiPropertyOptional({ example: 'Dr. Benali' })
  @IsString()
  @IsOptional()
  prescriptorName?: string;

  @ApiPropertyOptional({ enum: PrescriptorType })
  @IsEnum(PrescriptorType)
  @IsOptional()
  prescriptorType?: PrescriptorType;

  @ApiProperty({ type: [CreateTestOrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateTestOrderItemDto)
  tests: CreateTestOrderItemDto[];
}
