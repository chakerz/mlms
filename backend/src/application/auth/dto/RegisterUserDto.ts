import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../../domain/common/types/UserRole';
import { Language } from '../../../domain/common/types/Language';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsEnum(Language)
  language?: Language;
}
