import { User } from '../../../domain/user/entities/User';

export class UserDto {
  id: string;
  email: string;
  role: string;
  language: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  static from(user: User): UserDto {
    const dto = new UserDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.role = user.role;
    dto.language = user.language;
    dto.isActive = user.isActive;
    dto.createdAt = user.createdAt.toISOString();
    dto.updatedAt = user.updatedAt.toISOString();
    return dto;
  }
}
