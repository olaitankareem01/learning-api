import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../auth/user.entity';
import { Topic } from '../topics/topic.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Progress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Topic)
  topic: Topic;

  @Column({ default: false })
  isCompleted: boolean;
}
