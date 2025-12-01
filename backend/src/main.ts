import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS cho production
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://tinphan247.github.io/User-Registration-API-with-React-Frontend', // Thay your-username
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // Quan trọng: bind to 0.0.0.0
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();