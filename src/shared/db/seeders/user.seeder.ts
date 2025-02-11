import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/modules/auth/user.entity';
import { Role } from 'src/modules/auth/role.entity';
import { Roles } from 'src/shared/models/enums/role.enum';

@Injectable()
export class UserSeederService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async seed() {

    const superAdminRole = await this.roleRepository.findOneBy({ name:Roles.SUPERADMIN });
    
    if (!superAdminRole) {
      console.log('Super Admin role does not exist. Please create it first.');
      return;
    }


    const existingUser = await this.userRepository.findOneBy({ email: 'learning@yopmail.com' });

    if (!existingUser) {

      const passwordHash = await bcrypt.hash('Learning2025!', 10);
      const superAdminUser = this.userRepository.create({
        email: 'learning@yopmail.com',
        firstName: 'Learning',
        lastName: 'Admin', 
        password: passwordHash,
        role: superAdminRole
      });

      await this.userRepository.save(superAdminUser);
      console.log('Inserted super-admin user: ', superAdminUser);
    } else {
      console.log('Super-admin user already exists: ', existingUser);
    }
  }
}
