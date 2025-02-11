import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { User } from '../src/modules/auth/user.entity';
import { Topic } from '../src/modules/topics/topic.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProgressService } from '../src/modules/progress/progress.service';
import { Progress } from '../src/modules/progress/progress.entity';

describe('ProgressService', () => {
  let progressService: ProgressService;
  let progressRepo: Repository<Progress>;
  let userRepo: Repository<User>;
  let topicRepo: Repository<Topic>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgressService,
        {
          provide: getRepositoryToken(Progress),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Topic),
          useClass: Repository,
        },
      ],
    }).compile();

    progressService = module.get<ProgressService>(ProgressService);
    progressRepo = module.get<Repository<Progress>>(getRepositoryToken(Progress));
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    topicRepo = module.get<Repository<Topic>>(getRepositoryToken(Topic));
  });

  describe('markProgress', () => {
    it('should throw NotFoundException if user or topic does not exist', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(topicRepo, 'findOne').mockResolvedValue(null);

      await expect(progressService.markProgress('1', '1')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if the topic is already completed', async () => {
      const user = { id: '1', firstName: 'John', lastName:'Doe',email:'johndoe@gmail.com' } as User;
      const topic = { id: '1', title: 'Algebra' } as Topic;
      const existingProgress = { id: '1', user, topic, isCompleted: true } as Progress;

      jest.spyOn(userRepo, 'findOne').mockResolvedValue(user);
      jest.spyOn(topicRepo, 'findOne').mockResolvedValue(topic);
      jest.spyOn(progressRepo, 'findOne').mockResolvedValue(existingProgress);

      await expect(progressService.markProgress('1', '1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('getSubjectRankings', () => {
    it('should return rankings for a subject', async () => {
      const rankings = [
        { userId: '1', completed_topics: 5 },
        { userId: '2', completed_topics: 3 },
      ];
      jest.spyOn(progressRepo, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(rankings),
      } as any);

      const result = await progressService.getSubjectRankings('1');

      expect(result).toEqual(rankings);
      expect(progressRepo.createQueryBuilder).toHaveBeenCalledWith('progress');
    });
  });

  describe('getSubjectProgress', () => {
    it('should throw NotFoundException if no topics exist for the subject', async () => {
      jest.spyOn(topicRepo, 'find').mockResolvedValue([]);

      await expect(progressService.getSubjectProgress('1', '1')).rejects.toThrow(NotFoundException);
    });

    it('should return progress details for a subject', async () => {
      const topics = [
        { id: '1', title: 'Topic 1' },
        { id: '2', title: 'Topic 2' },
      ] as Topic[];
      const completedProgress = [
        { topic: { id: '1', title: 'Topic 1' }, isCompleted: true },
      ] as Progress[];

      jest.spyOn(topicRepo, 'find').mockResolvedValue(topics);
      jest.spyOn(progressRepo, 'find').mockResolvedValue(completedProgress);

      const result = await progressService.getSubjectProgress('1', '1');

      expect(result).toEqual({
        userId: '1',
        subjectId: '1',
        completedTopics: 1,
        totalTopics: 2,
        completionPercentage: '50.00%',
        topics: [
          { id: '1', name: 'Topic 1', isCompleted: true },
          { id: '2', name: 'Topic 2', isCompleted: false },
        ],
      });
    });
  });
});
