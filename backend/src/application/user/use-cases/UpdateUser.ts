import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IUserRepository } from '../../../domain/user/repositories/IUserRepository';
import { User } from '../../../domain/user/entities/User';
import { UpdateUserDto } from '../dto/UpdateUserDto';
import { UserDto } from '../dto/UserDto';

@Injectable()
export class UpdateUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string, dto: UpdateUserDto, currentUserId: string): Promise<UserDto> {
    const existing = await this.userRepository.findById(id);
    if (!existing) throw new NotFoundException(`User ${id} not found`);

    if (dto.isActive === false && id === currentUserId) {
      throw new ForbiddenException('Cannot deactivate your own account');
    }

    const updated = new User(
      existing.id,
      existing.email,
      existing.passwordHash,
      dto.role ?? existing.role,
      dto.language ?? existing.language,
      dto.isActive !== undefined ? dto.isActive : existing.isActive,
      existing.createdAt,
      new Date(),
    );

    const saved = await this.userRepository.save(updated);
    return UserDto.from(saved);
  }
}
