import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from './topic.entity';
import { CreateTopicDto } from '../../shared/models/dtos/topic.dto';
import { Subject } from '../subjects/subject.entity';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic) private topicRepo: Repository<Topic>,
    @InjectRepository(Subject) private subjectRepo: Repository<Subject>,
  ) {}

  async createTopic(dto: CreateTopicDto) {
    const subject = await this.subjectRepo.findOne({ where: { id: dto.subjectId } });
    if (!subject) throw new Error('Subject not found');

    const topic = this.topicRepo.create({ ...dto, subject });
    await this.topicRepo.save(topic);
    return topic;
  }

  async getTopics(subjectId: string) {
    return this.topicRepo.find({ where: { subject: { id: subjectId } } });
  }

  async getTopic(topicId: string) {
    return this.topicRepo.findOne({ where: { id: topicId } });
  }
}
