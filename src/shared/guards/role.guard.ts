import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../models/enums/role.enum';
import { ROLES_KEY } from '../decorators/role.decorators';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest(); 
    console.log(user)
    if (!user || !user.role) {
      throw new ForbiddenException('Access Denied');
    }
    
    return requiredRoles.some((role) => user.role.name == role);
  }
}
