import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePractitionerDto {
  @ApiPropertyOptional({ example: 'Dr. Ahmed Benali' })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ example: 'ahmed.benali@clinic.ma' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '+212661234567' })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: '12 Avenue Mohammed V, Casablanca' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'Cardiologie' })
  @IsString()
  @IsOptional()
  speciality?: string;

  @ApiPropertyOptional({ example: 'Cardiologue Spécialiste' })
  @IsString()
  @IsOptional()
  qualification?: string;

  @ApiPropertyOptional({ example: 'LIC-2024-001' })
  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
