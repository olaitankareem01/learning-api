import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Progress } from './progress.entity';
import { User } from '../auth/user.entity';
import { Topic } from '../topics/topic.entity';

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
      .addSelect('COUNT(progress.id)', "completed_topics")
      .orderBy('"completed_topics"', 'DESC') 
      .getRawMany();

    return rankings;
   }

   async getSubjectProgress(userId: string, subjectId: string) {
    const topics = await this.topicRepository.find({
      where: { subject: { id: subjectId } },
    });

    if (topics.length === 0) {
      throw new NotFoundException('No topics found for this subject');
    }

    const completedProgress = await this.progressRepository.find({
      where: {
        user: { id: userId },
        topic: { subject: { id: subjectId } },
        isCompleted: true,
      },
      relations: ['topic'],
    });

    const completedTopicIds = new Set(completedProgress.map(progress => progress.topic.id));

    const topicList = topics.map(topic => ({
      id: topic.id,
      name: topic.title,
      isCompleted: completedTopicIds.has(topic.id),
    }));


    const completedTopicsCount = completedTopicIds.size;
    const totalTopics = topics.length;
    const completionPercentage = (completedTopicsCount / totalTopics) * 100;

    return {
      userId,
      subjectId,
      completedTopics: completedTopicsCount,
      totalTopics,
      completionPercentage: completionPercentage.toFixed(2) + '%',
      topics: topicList,
    };
  }

}
