import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { BcryptPasswordHasher } from '../infrastructure/security/hashing/BcryptPasswordHasher';
import { JwtTokenService } from '../infrastructure/security/jwt/JwtTokenService';
import { JwtAuthGuard } from '../interfaces/http/guards/JwtAuthGuard';
import { RolesHttpGuard } from '../interfaces/http/guards/RolesHttpGuard';

export const PASSWORD_HASHER = 'IPasswordHasher';
export const TOKEN_SERVICE = 'ITokenService';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('auth.jwtSecret'),
        signOptions: { expiresIn: config.get<string>('auth.jwtExpiresIn') },
      }),
    }),
  ],
  providers: [
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
    { provide: TOKEN_SERVICE, useClass: JwtTokenService },
    JwtAuthGuard,
    RolesHttpGuard,
  ],
  exports: [PASSWORD_HASHER, TOKEN_SERVICE, JwtModule, JwtAuthGuard, RolesHttpGuard],
})
export class SharedModule {}
