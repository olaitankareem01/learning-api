import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/modules/auth/role.entity';
import { Repository } from 'typeorm';


@Injectable()
export class RoleSeederService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async seed() {
    const roles = [
      { name: 'teacher' },
      { name: 'learner' },
      { name: 'admin' },
      { name: 'super-admin' },
    ];

    for (const roleData of roles) {
      const roleExists = await this.roleRepository.findOneBy({ name: roleData.name });

      if (!roleExists) {
        const role = this.roleRepository.create(roleData);
        await this.roleRepository.save(role);
        console.log(`Inserted role: ${roleData.name}`);
      } else {
        console.log(`Role already exists: ${roleData.name}`);
      }
    }
  }
}
