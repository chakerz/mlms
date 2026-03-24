import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../../domain/user/repositories/IUserRepository';
import { User } from '../../../domain/user/entities/User';
import { Language } from '../../../domain/common/types/Language';
import { MeDto } from '../dto/MeDto';

@Injectable()
export class ChangeUserLanguage {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string, language: Language): Promise<MeDto> {
    const existing = await this.userRepository.findById(userId);
    if (!existing) throw new NotFoundException(`User ${userId} not found`);

    const updated = new User(
      existing.id,
      existing.email,
      existing.passwordHash,
      existing.role,
      language,
      existing.isActive,
      existing.createdAt,
      new Date(),
    );

    const saved = await this.userRepository.save(updated);
    return {
      id: saved.id,
      email: saved.email,
      role: saved.role,
      language: saved.language,
      isActive: saved.isActive,
    };
  }
}
