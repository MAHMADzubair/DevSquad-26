import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for HTTP
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });
  
  // Setup WebSocket adapter
  app.useWebSocketAdapter(new IoAdapter(app));
  
  await app.listen(process.env.PORT ?? 3000);
  console.log('Server running on http://localhost:3000');
}
bootstrap();
