import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Topic } from '../topics/topic.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Subject {
 @PrimaryGeneratedColumn('uuid')
 id: string;

  @ApiProperty()
  @Column({ unique: true })
  name: string;


  @ApiProperty()
  @Column({nullable:true})
  description?: string;

  @OneToMany(() => Topic, (topic) => topic.subject)
  topics: Topic[];
}
