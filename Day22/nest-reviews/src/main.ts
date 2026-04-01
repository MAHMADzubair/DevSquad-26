import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const origins = [
    'http://localhost:5173',
    ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : []),
  ].filter(Boolean);

  app.enableCors({
    origin: origins,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 NestJS Reviews Service running on http://localhost:${port}`);
}
bootstrap();
