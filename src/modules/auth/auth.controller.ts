import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from '../../shared/models/dtos/auth.dto';
import { JwtAuthGuard } from 'src/shared/guards/auth.guard';
import { RolesGuard } from 'src/shared/guards/role.guard';
import { RolesAllowed } from 'src/shared/decorators/role.decorators';
import { Roles } from 'src/shared/models/enums/role.enum';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBearerAuth()
  @Post('/user/create')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @RolesAllowed(Roles.SUPERADMIN,Roles.ADMIN)
  signUp(@Body() body: SignUpDto) {
    return this.authService.createUser(body);
  }

  @Post('login')
  signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }

  @ApiBearerAuth()
  @Get('roles')
  @UseGuards(JwtAuthGuard,RolesGuard)
  getRoles(){
    return this.authService.getRoles()
  }
}
