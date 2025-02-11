import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity'
import { SignUpDto, SignInDto } from '../../shared/models/dtos/auth.dto';
import { Role } from './role.entity';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository:Repository<Role>,
    private jwtService: JwtService,
  ) {}

  async createUser(signUpDto: SignUpDto) {
    const role = await this.roleRepository.findOne({where:{id:signUpDto.roleId}})
    if(!role){
       throw new NotFoundException("Role not found")
    }
    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
    const user = this.userRepository.create({ ...signUpDto, password: hashedPassword });
    await this.userRepository.save(user);
    return user;
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userRepository.findOne({ where: { email: signInDto.email }, relations:['role'] });
    if (!user || !(await bcrypt.compare(signInDto.password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const payload = { id: user.id, firstName:user.firstName, role: user.role }
    const token = this.jwtService.sign(payload,{ expiresIn: (process.env.JWT_EXPIRY||'1h'),secret:process.env.JWT_SECRET });
    return { token, firstName:user.firstName, lastName:user.lastName, role:user.role.name };
  }

  async getRoles(){
     return await this.roleRepository.find();
  }
}
