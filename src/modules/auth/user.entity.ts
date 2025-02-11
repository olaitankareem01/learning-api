import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  
  @Column()
  lastName: string;

  @ApiProperty()
  @Column()
  password: string;

  // @ApiProperty({enum: ['admin', 'teacher', 'learner'] })
  // @Column({ default: 'learner' })
  // role: string;

  @ManyToOne(() => Role)
  role: Role;

  @CreateDateColumn()
  createdAt: Date;
}
