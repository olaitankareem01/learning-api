import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from './subject.entity';
import { CreateSubjectDto } from '../../shared/models/dtos/create-subject.dto';

@Injectable()
export class SubjectService {
  constructor(@InjectRepository(Subject) private subjectRepo: Repository<Subject>) {}

  async createSubject(dto: CreateSubjectDto) {
    const existingSubject = await this.subjectRepo.findOne({ where: { name: dto.name } });
    if (existingSubject) return `Subject ${dto.name} already exists`;
    const subject = this.subjectRepo.create(dto);
    await this.subjectRepo.save(subject);
    return subject;
  }

  async getSubjects() {
    return this.subjectRepo.find({ relations: ['topics'] });
  }
}
