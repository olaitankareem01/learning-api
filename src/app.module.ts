import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './modules/auth/auth.controller';
import { TopicController } from './modules/topics/topic.controller';
import { SubjectController } from './modules/subjects/subject.controller';
import { ProgressController } from './modules/progress/progress.controller';
import { TopicService } from './modules/topics/topic.service';
import { AuthService } from './modules/auth/auth.service';
import { SubjectService } from './modules/subjects/subject.service';
import { ProgressService } from './modules/progress/progress.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from './shared/db/db.config';
import { Topic } from './modules/topics/topic.entity';
import { User } from './modules/auth/user.entity';
import { Subject } from './modules/subjects/subject.entity';
import { Progress } from './modules/progress/progress.entity';
import { JwtService } from '@nestjs/jwt';
import { RoleSeederService } from './shared/db/seeders/role.seeder';
import { UserSeederService } from './shared/db/seeders/user.seeder';
import { Role } from './modules/auth/role.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...dataSource.options,
      }),
    }),

    TypeOrmModule.forFeature([Topic,User,Subject,Progress,Role])
  ],
  controllers: [AppController,AuthController,TopicController,SubjectController,ProgressController],
  providers: [AppService,TopicService,AuthService,SubjectService,ProgressService,JwtService,RoleSeederService,UserSeederService],
})
export class AppModule implements OnModuleInit {
  constructor(
     private readonly roleSeederService: RoleSeederService,
     private readonly userSeederService: UserSeederService
    ) {}

  async onModuleInit() {
    await this.roleSeederService.seed(); 
    await this.userSeederService.seed();
  }
}