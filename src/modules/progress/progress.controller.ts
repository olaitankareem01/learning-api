import { Controller, Post, Body, Request, UseGuards, Get, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { MarkProgressDto } from '../../shared/models/dtos/progress.dto';
import { JwtAuthGuard } from 'src/shared/guards/auth.guard';
import { RolesGuard } from 'src/shared/guards/role.guard';
import { RolesAllowed } from 'src/shared/decorators/role.decorators';
import { Roles } from 'src/shared/models/enums/role.enum';

@ApiBearerAuth()
@ApiTags('Progress')
@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('progress')
export class ProgressController {
  constructor(private progressService: ProgressService) {}


  @Post('mark-as-completed')
  @RolesAllowed(Roles.LEARNER,Roles.SUPERADMIN)
  markProgress(@Body() body: MarkProgressDto, @Request() req) {
    return this.progressService.markProgress(req.user.id, body.topicId);
  }


  @Get('ranking/:subjectId')
  @RolesAllowed(Roles.TEACHER,Roles.ADMIN,Roles.SUPERADMIN)
  getRankings(@Param('subjectId') subjectId: string) {
    return this.progressService.getSubjectRankings(subjectId);
  }
}
