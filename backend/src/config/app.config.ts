import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.BACKEND_PORT ?? '3000', 10),
  prefix: process.env.API_PREFIX ?? 'api',
  defaultLanguage: process.env.DEFAULT_LANGUAGE ?? 'FR',
}));
