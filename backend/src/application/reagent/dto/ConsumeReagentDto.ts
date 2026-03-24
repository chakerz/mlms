import { IsString, IsNotEmpty, IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConsumeReagentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lotId!: string;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  quantity!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  testCode!: string;
}
