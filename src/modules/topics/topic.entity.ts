import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Subject } from '../subjects/subject.entity';


@Entity()
export class Topic {
 @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;


  @Column({nullable:true})
  video?: string;

  @Column({nullable:true})
  image?: string;

  @Column({nullable:true})
  audio?: string;
 
  @Column({nullable:true})
  description?: string;

  @ManyToOne(() => Subject, (subject) => subject.topics)
  subject: Subject;
}
