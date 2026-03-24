import { IsString, IsEmail, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { Gender } from '../../../domain/common/types/Gender';

export class RegisterPatientDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsDateString()
  birthDate: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsString()
  phone?: string | null;

  @IsOptional()
  @IsEmail()
  email?: string | null;

  @IsOptional()
  @IsString()
  address?: string | null;
}
