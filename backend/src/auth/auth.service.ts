// backend/src/auth/auth.service.ts

import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginUserDto, JwtPayload, Tokens } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const payload: JwtPayload = { id: userId, email };
    
    // Đảm bảo bạn có các biến môi trường cho Secret/Expiration
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: 'YOUR_JWT_ACCESS_SECRET', // Cấu hình trong JwtModule
        expiresIn: '15m', // Thời gian sống ngắn
      }),
      this.jwtService.signAsync(payload, {
        secret: 'YOUR_JWT_REFRESH_SECRET', // Cấu hình trong JwtModule
        expiresIn: '7d', // Thời gian sống dài
      }),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }
  
  async updateRtHash(userId: string, rt: string): Promise<void> {
    const hash = await bcrypt.hash(rt, 10);
    
    // Lưu hashed Refresh Token vào database
    await this.userService.updateUserRtHash(userId, hash);
  }

  async login(loginUserDto: LoginUserDto): Promise<Tokens> {
    const user = await this.userService.findByEmail(loginUserDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);
    
    return tokens;
  }
  
  async logout(userId: string): Promise<void> {
    // Xóa hash Refresh Token khỏi database khi logout
    await this.userService.updateUserRtHash(userId, null);
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    const user = await this.userService.findById(userId);

    if (!user || !user.hashedRt) {
      throw new ForbiddenException('Access Denied');
    }

    // So sánh Refresh Token nhận được với hash trong DB
    const rtMatches = await bcrypt.compare(refreshToken, user.hashedRt);

    if (!rtMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);

    return tokens;
  }
}