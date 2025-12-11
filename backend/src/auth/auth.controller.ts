// backend/src/auth/auth.controller.ts

import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './auth.dto';
import { Public } from '../common/decorators/public.decorator';
import { RefreshJwtGuard } from '../common/guards/refresh-jwt.guard'; 

// Đảm bảo bạn tạo refresh-jwt.guard.ts tương tự access-jwt.guard.ts 
// hoặc chỉ cần dùng AuthGuard('jwt-refresh')

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public() // Cho phép truy cập không cần token
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: any) {
    // Giả định JwtPayload được đính kèm vào req.user bởi JwtStrategy
    await this.authService.logout(req.user.id);
    return { message: 'Logout successful' };
  }

  @Public() // Refresh token không cần Access Token, nhưng cần Refresh Token
  @UseGuards(RefreshJwtGuard) // Sử dụng RefreshJwtGuard
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Req() req: any) {
    const userId = req.user.id;
    const refreshToken = req.user.refreshToken; // Từ RefreshJwtStrategy
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Get('protected')
  @HttpCode(HttpStatus.OK)
  getProtectedData(@Req() req: any) {
    // Route này được bảo vệ bởi AccessJwtGuard (được áp dụng global)
    return { 
        message: 'This is protected data',
        user: req.user
    };
  }
}