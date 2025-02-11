import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TopicService } from './topic.service';
import { CreateTopicDto } from '../../shared/models/dtos/topic.dto';
import { JwtAuthGuard } from 'src/shared/guards/auth.guard';
import { RolesAllowed } from 'src/shared/decorators/role.decorators';
import { Roles } from 'src/shared/models/enums/role.enum';

@ApiTags('Topics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('topics')
export class TopicController {
  constructor(private topicService: TopicService) {}

  @Post()
  @RolesAllowed(Roles.SUPERADMIN,Roles.ADMIN,Roles.TEACHER)
  createTopic(@Body() body: CreateTopicDto) {
    return this.topicService.createTopic(body);
  }



  @Get('subject/:subjectId')
  @RolesAllowed(Roles.SUPERADMIN,Roles.ADMIN,Roles.TEACHER,Roles.LEARNER)
  getTopics(@Param('subjectId') subjectId: string) {
    return this.topicService.getTopics(subjectId);
  }

  @Get(':topicId')
  @RolesAllowed(Roles.SUPERADMIN,Roles.ADMIN,Roles.TEACHER,Roles.LEARNER)
  getTopic(@Param('topicId') topicId: string) {
    return this.topicService.getTopic(topicId);
  }
}
