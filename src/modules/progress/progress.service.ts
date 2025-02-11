import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Progress } from './progress.entity';
import { User } from 'src/modules/auth/user.entity';
import { Topic } from 'src/modules/topics/topic.entity';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress) private progressRepository: Repository<Progress>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Topic) private topicRepository: Repository<Topic>,
) {}
  async markProgress(userId: string, topicId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const topic = await this.topicRepository.findOne({ where: { id: topicId } });
  
    if (!user || !topic) {
      throw new NotFoundException('User or Topic not found');
    }

    const existingProgress = this.progressRepository.findOne({
      where:{
        user:{id:userId},  
        topic:{id:topicId},
        isCompleted: true,
      }
    
    });
    if (existingProgress) {
      throw new BadRequestException('This topic has already been completed');
    }


  
    const progress = this.progressRepository.create({
      user,  
      topic,
      isCompleted: true,
    });
  
    await this.progressRepository.save(progress);
    
    return progress;
  }
  
  async getSubjectRankings(subjectId: string) {
    const rankings = await this.progressRepository
      .createQueryBuilder('progress')
      .leftJoinAndSelect('progress.user', 'user')
      .leftJoinAndSelect('progress.topic', 'topic')
      .where('topic.subjectId = :subjectId', { subjectId })
      .groupBy('progress.userId')
      .select('progress.userId', 'userId')
      .addSelect('COUNT(progress.id)', "completed_topics") // Fix: Use double quotes
      .orderBy('"completed_topics"', 'DESC') // Fix: Match alias exactly
      .getRawMany();

    return rankings;
   }

}
