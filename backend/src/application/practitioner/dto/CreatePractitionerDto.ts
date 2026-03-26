import { IsString, IsNotEmpty, IsEmail, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePractitionerDto {
  @ApiProperty({ example: 'Dr. Ahmed Benali' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'ahmed.benali@clinic.ma' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

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

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
