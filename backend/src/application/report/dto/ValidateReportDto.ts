import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ValidateReportDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  commentsFr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  commentsAr?: string;
}
