// backend/src/common/guards/refresh-jwt.guard.ts

import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

// Guard này sử dụng strategy 'jwt-refresh' đã được định nghĩa
@Injectable()
export class RefreshJwtGuard extends AuthGuard('jwt-refresh') {}