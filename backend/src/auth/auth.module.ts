// backend/src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { RefreshJwtStrategy } from './refresh-jwt.strategy';

@Module({
  imports: [
    UserModule, // Cần UserModule để sử dụng UserService
    PassportModule,
    JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async () => ({
            // Cấu hình chung cho JWT, Secrets được định nghĩa lại trong service/strategy
            secret: 'YOUR_JWT_ACCESS_SECRET', 
            signOptions: { expiresIn: '15m' },
        }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    JwtStrategy, 
    RefreshJwtStrategy,
    // Thêm các providers khác như Guards nếu cần
  ],
  exports: [AuthService]
})
export class AuthModule {}