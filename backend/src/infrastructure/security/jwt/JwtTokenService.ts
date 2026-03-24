import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenService } from '../../../application/common/interfaces/ITokenService';

@Injectable()
export class JwtTokenService implements ITokenService {
  constructor(private readonly jwtService: JwtService) {}

  async sign(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async verify(token: string): Promise<Record<string, unknown>> {
    return this.jwtService.verifyAsync(token);
  }
}
