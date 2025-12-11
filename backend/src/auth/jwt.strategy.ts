// backend/src/auth/jwt.strategy.ts

import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './auth.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'YOUR_JWT_ACCESS_SECRET', // Thay thế bằng biến môi trường
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    // Logic này sẽ chạy sau khi giải mã thành công Access Token
    return payload; 
  }
}