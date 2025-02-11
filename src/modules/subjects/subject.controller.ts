import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from '../../shared/models/dtos/create-subject.dto';
import { JwtAuthGuard } from 'src/shared/guards/auth.guard';
import { RolesGuard } from 'src/shared/guards/role.guard';
import { RolesAllowed } from 'src/shared/decorators/role.decorators';
import { Roles } from 'src/shared/models/enums/role.enum';

@ApiTags('Subjects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('subjects')
export class SubjectController {
  constructor(private subjectService: SubjectService) {}

  @Post()
  @RolesAllowed(Roles.SUPERADMIN,Roles.ADMIN,Roles.TEACHER)
  createSubject(@Body() body: CreateSubjectDto) {
    return this.subjectService.createSubject(body);
  }

  @Get()
  @RolesAllowed(Roles.SUPERADMIN,Roles.ADMIN,Roles.TEACHER,Roles.LEARNER)
  getSubjects() {
    return this.subjectService.getSubjects();
  }
}
