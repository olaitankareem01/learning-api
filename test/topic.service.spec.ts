import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TopicService } from '../src/modules/topics/topic.service';
import { Topic } from '../src/modules/topics/topic.entity';
import { Subject } from '../src/modules/subjects/subject.entity';
import { CreateTopicDto } from '../src/shared/models/dtos/topic.dto';
import { title } from 'process';

describe('TopicService', () => {
  let topicService: TopicService;
  let topicRepo: Repository<Topic>;
  let subjectRepo: Repository<Subject>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicService,
        {
          provide: getRepositoryToken(Topic),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Subject),
          useClass: Repository,
        },
      ],
    }).compile();

    topicService = module.get<TopicService>(TopicService);
    topicRepo = module.get<Repository<Topic>>(getRepositoryToken(Topic));
    subjectRepo = module.get<Repository<Subject>>(getRepositoryToken(Subject));
  });

  describe('createTopic', () => {
    it('should throw an error if the subject does not exist', async () => {
      const dto: CreateTopicDto = { title: 'Algebra', subjectId: '1', description:"tyu" };
      jest.spyOn(subjectRepo, 'findOne').mockResolvedValue(null);

      await expect(topicService.createTopic(dto)).rejects.toThrow('Subject not found');
    });

    it('should create and return a new topic', async () => {
      const subject = { id: '1', name: 'Math' } as Subject;
      const dto: CreateTopicDto = { title: 'Geometry', subjectId: '1rtey', description:"something simp;e" };
      jest.spyOn(subjectRepo, 'findOne').mockResolvedValue(subject);
      jest.spyOn(topicRepo, 'create').mockImplementation((topic) => topic as Topic);
      jest.spyOn(topicRepo, 'save').mockResolvedValue({ id: '2', title: 'Geometry',description:"something simp;e", subject } as Topic);

      const result = await topicService.createTopic(dto);
      expect(topicRepo.create).toHaveBeenCalledWith({ ...dto, subject });
      expect(topicRepo.save).toHaveBeenCalled();
    });
  });

  describe('getTopics', () => {
    it('should return topics under a given subject', async () => {
      const topics = [
        { id: '1', title: 'Algebra', subject: { id: '1' } },
        { id: '2', title: 'Geometry', subject: { id: '1' } },
      ];
      jest.spyOn(topicRepo, 'find').mockResolvedValue(topics as Topic[]);

      const result = await topicService.getTopics('1');

      expect(result).toEqual(topics);
      expect(topicRepo.find).toHaveBeenCalledWith({ where: { subject: { id: '1' } } });
    });
  });

  describe('getTopic', () => {
    it('should return a topic by ID', async () => {
      const topic =   { id: '1', title: 'Algebra', subject: { id: '1' } } as Topic;
      jest.spyOn(topicRepo, 'findOne').mockResolvedValue(topic);

      const result = await topicService.getTopic('1');

      expect(result).toEqual(topic);
      expect(topicRepo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should return null if the topic does not exist', async () => {
      jest.spyOn(topicRepo, 'findOne').mockResolvedValue(null);

      const result = await topicService.getTopic('999');

      expect(result).toBeNull();
    });
  });
});
