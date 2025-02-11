import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { AuthService } from '../src/modules/auth/auth.service';
import { User } from '../src/modules/auth/user.entity';
import { Role } from '../src/modules/auth/role.entity';
import { SignInDto, SignUpDto } from '../src/shared/models/dtos/auth.dto';


describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Role),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mockJwtToken'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('createUser', () => {
    it('should throw NotFoundException if role does not exist', async () => {
      jest.spyOn(roleRepository, 'findOne').mockResolvedValue(null);

      const signUpDto: SignUpDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'password123',
        roleId: '123',
      };

      await expect(authService.createUser(signUpDto)).rejects.toThrow(NotFoundException);
    });

  });

  describe('signIn', () => {
    it('should throw an error if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      const signInDto: SignInDto = { email: 'test@example.com', password: 'password123' };

      await expect(authService.signIn(signInDto)).rejects.toThrow('Invalid credentials');
    });


  });

  describe('getRoles', () => {
    it('should return all roles', async () => {
      const roles = [{ id: '1', name: 'Learner' }, { id: '2', name: 'Admin' }];
      jest.spyOn(roleRepository, 'find').mockResolvedValue(roles as Role[]);

      const result = await authService.getRoles();
      expect(result).toEqual(roles);
    });
  });
});
