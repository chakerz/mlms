import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TestOrderPriority } from '../../../domain/order/types/TestOrderPriority';

export class CreateTestOrderItemDto {
  @ApiProperty({ example: 'HGB' })
  @IsString()
  @IsNotEmpty()
  testCode: string;

  @ApiProperty({ example: 'Hémoglobine' })
  @IsString()
  @IsNotEmpty()
  testNameFr: string;

  @ApiProperty({ example: 'الهيموغلوبين' })
  @IsString()
  @IsNotEmpty()
  testNameAr: string;

  @ApiPropertyOptional({ enum: TestOrderPriority, default: TestOrderPriority.ROUTINE })
  @IsEnum(TestOrderPriority)
  @IsOptional()
  priority?: TestOrderPriority;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}
