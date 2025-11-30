// backend/src/main.ts

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Lấy PORT từ biến môi trường hoặc dùng 3000 (Local)
  const port = process.env.PORT || 3000; 

  // Enable CORS
  app.enableCors({
    // THAY THẾ CHUỖI NÀY BẰNG URL FRONTEND ĐÃ TRIỂN KHAI CỦA BẠN (ví dụ: Vercel/Netlify)
    origin: [
      `http://localhost:5173`, 
      'http://localhost:3000',
      'https://tinphan247.github.io/User-Registration-API-with-React-Frontend' // << SỬA ĐIỂM NÀY
    ],
    credentials: true,
  });
  
  // ... (Giữ nguyên Global validation pipe)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(port);
  console.log(`🚀 Application is running on port: ${port}`);
}
bootstrap();