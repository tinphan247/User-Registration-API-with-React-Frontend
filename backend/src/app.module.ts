// backend/src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module'; // IMPORT MỚI
import { AccessJwtGuard } from './common/guards/access-jwt.guard'; // IMPORT MỚI
import { APP_GUARD } from '@nestjs/core'; // IMPORT MỚI
// import { User } from './user/user.entity'; // Nếu bạn có User Entity, hãy import nó

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Khi triển khai lên Render, Render sẽ tự động cấp biến môi trường, 
      // không cần chỉ định file .env ở đây.
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME', 'user_registration_db'),
        
        // ********* ĐIỀM SỬA CHỮA QUAN TRỌNG *********
        
        // Sửa entities để chỉ định rõ ràng khi chạy production/build
        // Bạn nên thay thế bằng mảng Entity: entities: [User], nếu có ít Entity
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        
        // 1. Bật SSL/TLS cho môi trường Production (Render)
        // NODE_ENV là biến được set tự động khi bạn sử dụng lệnh start:prod
        ssl: configService.get<string>('NODE_ENV') === 'production' ? { 
            rejectUnauthorized: false // Cần thiết cho các host tự ký chứng chỉ như Render
        } : false,

        // 2. Bật/Tắt Synchronize
        // Chỉ bật synchronize: true cho lần triển khai đầu tiên (để tạo bảng)
        // SAU KHI TRIỂN KHAI THÀNH CÔNG, HÃY CHUYỂN VỀ 'false'!
        synchronize: true,
        
        // **********************************************
        
        logging: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
  ],
  providers: [
    {
        provide: APP_GUARD, // ÁP DỤNG GUARD TOÀN CỤC
        useClass: AccessJwtGuard,
    },
  ],
})
export class AppModule {}