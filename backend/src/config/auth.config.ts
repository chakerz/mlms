import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET ?? 'change_me_please',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS ?? '10', 10),
}));
