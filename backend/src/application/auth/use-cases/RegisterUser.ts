import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../domain/user/repositories/IUserRepository';
import { IPasswordHasher } from '../../common/interfaces/IPasswordHasher';
import { User } from '../../../domain/user/entities/User';
import { Language } from '../../../domain/common/types/Language';
import { ConflictDomainException } from '../../../domain/common/exceptions/ConflictDomainException';
import { RegisterUserDto } from '../dto/RegisterUserDto';
import { MeDto } from '../dto/MeDto';

@Injectable()
export class RegisterUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(dto: RegisterUserDto): Promise<MeDto> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictDomainException('Email already registered');
    }

    const passwordHash = await this.passwordHasher.hash(dto.password);
    const user = new User(
      '',
      dto.email,
      passwordHash,
      dto.role,
      dto.language ?? Language.FR,
      true,
      new Date(),
      new Date(),
    );
    const saved = await this.userRepository.save(user);

    return {
      id: saved.id,
      email: saved.email,
      role: saved.role,
      language: saved.language,
      isActive: saved.isActive,
    };
  }
}
