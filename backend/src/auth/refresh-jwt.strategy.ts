// backend/src/auth/refresh-jwt.strategy.ts

import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtRefreshPayload } from './auth.dto';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'YOUR_JWT_REFRESH_SECRET', // Thay thế bằng biến môi trường
      passReqToCallback: true, // Cho phép truy cập request
    });
  }

  async validate(req: Request, payload: JwtRefreshPayload) {
    const authHeader = req.get('Authorization');
    
    if (!authHeader) {
      throw new UnauthorizedException('Refresh token not found');
    }
    
    const refreshToken = authHeader.replace('Bearer', '').trim();
    
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    // Gán Refresh Token vào payload để Auth Service có thể sử dụng
    return { ...payload, refreshToken };
  }
}