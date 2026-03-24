import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../domain/user/repositories/IUserRepository';
import { DomainNotFoundException } from '../../../domain/common/exceptions/NotFoundException';
import { MeDto } from '../dto/MeDto';

@Injectable()
export class GetCurrentUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<MeDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new DomainNotFoundException('User', userId);
    }
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      language: user.language,
      isActive: user.isActive,
    };
  }
}
