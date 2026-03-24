import { IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { UserRole } from '../../../domain/common/types/UserRole';
import { Language } from '../../../domain/common/types/Language';

export class UpdateUserDto {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEnum(Language)
  language?: Language;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
