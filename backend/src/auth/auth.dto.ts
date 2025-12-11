// backend/src/auth/auth.dto.ts

import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

// Tái sử dụng RegisterUserDto từ user.dto.ts nếu cấu trúc giống nhau
// Nếu không, bạn có thể định nghĩa lại hoặc import từ 'src/user/user.dto'

export class LoginUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

// Interface cho JWT payload (access token)
export interface JwtPayload {
  id: string;
  email: string;
  // Bạn có thể thêm vai trò (role) nếu có
}

// Interface cho JWT Refresh Token payload
export interface JwtRefreshPayload extends JwtPayload {
  refreshToken: string;
}

// Interface cho Response khi đăng nhập/refresh token
export interface Tokens {
  accessToken: string;
  refreshToken: string;
}