import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './interfaces/http/filters/GlobalHttpExceptionFilter';
import { validationConfig } from './config/validation.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix(process.env.API_PREFIX ?? 'api');

  // CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe(validationConfig));

  // Global exception filter
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  // Swagger / OpenAPI UI
  const swaggerConfig = new DocumentBuilder()
    .setTitle('MLMS API')
    .setDescription('Medical Laboratory Management System')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = parseInt(process.env.BACKEND_PORT ?? '3000', 10);
  await app.listen(port);
  console.log(`🚀 Backend: http://localhost:${port}/api`);
  console.log(`📚 Swagger: http://localhost:${port}/api/docs`);
}

bootstrap();
