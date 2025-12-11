<<<<<<< HEAD
// backend/src/user/user.service.ts (MODIFIED)

=======
>>>>>>> origin/main
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { RegisterUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<{ message: string; user: Partial<User> }> {
    const { email, password } = registerUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);

<<<<<<< HEAD
    // Return response without password and hashedRt
    const { password: _, hashedRt: __, ...userWithoutSecrets } = savedUser;

    return {
      message: 'User registered successfully',
      user: userWithoutSecrets,
    };
  }

  // Phương thức mới: Tìm kiếm User bằng Email (dùng cho Login)
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  // Phương thức mới: Tìm kiếm User bằng ID (dùng cho Refresh Token)
  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  // Phương thức mới: Cập nhật Hash Refresh Token
  async updateUserRtHash(userId: string, hashedRt: string | null): Promise<void> {
    await this.userRepository.update(
      { id: userId },
      { hashedRt },
    );
  }
=======
    // Return response without password
    const { password: _, ...userWithoutPassword } = savedUser;

    return {
      message: 'User registered successfully',
      user: userWithoutPassword,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
>>>>>>> origin/main
}