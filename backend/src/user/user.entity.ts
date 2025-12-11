import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

// THAY ĐỔI: Thêm type: 'varchar' để TypeORM hiểu đây là một chuỗi
  @Column({ nullable: true, type: 'varchar' }) // <--- DÒNG ĐÃ SỬA
  hashedRt: string | null;

  @CreateDateColumn()
  createdAt: Date;
}