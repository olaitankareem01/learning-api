import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SubjectService } from '../src/modules/subjects/subject.service';
import { Subject } from '../src/modules/subjects/subject.entity';
import { CreateSubjectDto } from '../src/shared/models/dtos/create-subject.dto';


describe('SubjectService', () => {
  let subjectService: SubjectService;
  let subjectRepo: Repository<Subject>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubjectService,
        {
          provide: getRepositoryToken(Subject),
          useClass: Repository,
        },
      ],
    }).compile();

    subjectService = module.get<SubjectService>(SubjectService);
    subjectRepo = module.get<Repository<Subject>>(getRepositoryToken(Subject));
  });

  describe('createSubject', () => {
    it('should return a message if subject already exists', async () => {
      const dto: CreateSubjectDto = { name: 'Mathematics' };
      jest.spyOn(subjectRepo, 'findOne').mockResolvedValue({ id: '1', name: 'Mathematics' } as Subject);

      const result = await subjectService.createSubject(dto);

      expect(result).toBe('Subject Mathematics already exists');
    });

    it('should create and return a new subject', async () => {
      const dto: CreateSubjectDto = { name: 'Physics' };
      jest.spyOn(subjectRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(subjectRepo, 'create').mockImplementation((subject) => subject as Subject);
      jest.spyOn(subjectRepo, 'save').mockResolvedValue({ id: '2', name: 'Physics' } as Subject);

      const result = await subjectService.createSubject(dto);
      expect(subjectRepo.create).toHaveBeenCalledWith(dto);
      expect(subjectRepo.save).toHaveBeenCalled();
    });
  });

  describe('getSubjects', () => {
    it('should return all subjects with related topics', async () => {
      const subjects = [
        { id: '1', name: 'Math', topics: [] },
        { id: '2', name: 'Physics', topics: [] },
      ];
      jest.spyOn(subjectRepo, 'find').mockResolvedValue(subjects as Subject[]);

      const result = await subjectService.getSubjects();

      expect(result).toEqual(subjects);
      expect(subjectRepo.find).toHaveBeenCalledWith({ relations: ['topics'] });
    });
  });
});
