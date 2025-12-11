import { Controller, Post, Body, HttpCode, HttpStatus, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './user.dto';
<<<<<<< HEAD
import { Public } from '../common/decorators/public.decorator';
=======

>>>>>>> origin/main
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

<<<<<<< HEAD
  @Public()
=======
>>>>>>> origin/main
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body(ValidationPipe) registerUserDto: RegisterUserDto) {
    return await this.userService.register(registerUserDto);
  }
}