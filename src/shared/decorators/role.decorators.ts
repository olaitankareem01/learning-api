import { SetMetadata } from '@nestjs/common';
import { Roles } from '../models/enums/role.enum';


export const ROLES_KEY = 'roles';
export const RolesAllowed = (...roles: Roles[]) => SetMetadata(ROLES_KEY, roles);
