import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { UPLOADS_DIR } from './uploads/uploads.constants';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  // Fotos enviadas pelo painel: http://localhost:3000/uploads/<arquivo>
  app.useStaticAssets(UPLOADS_DIR, { prefix: '/uploads/' });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Endereço do site (front). Vem do .env para funcionar em outra porta
  // ou, mais para frente, no domínio de verdade.
  app.enableCors({
    origin: process.env.WEB_URL ?? 'http://localhost:5173',
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Ateliê Flora API')
    .setDescription('API do e-commerce da floricultura Ateliê Flora')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
