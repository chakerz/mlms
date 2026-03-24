import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '../../../domain/user/repositories/IUserRepository';
import { IPasswordHasher } from '../../common/interfaces/IPasswordHasher';
import { ITokenService } from '../../common/interfaces/ITokenService';
import { LoginDto } from '../dto/LoginDto';
import { LoginResponseDto } from '../dto/LoginResponseDto';

@Injectable()
export class Login {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await this.passwordHasher.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.tokenService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        language: user.language,
      },
    };
  }
}
