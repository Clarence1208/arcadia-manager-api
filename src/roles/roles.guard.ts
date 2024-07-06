import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

import { Role } from './roles.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {} // Inject Reflector

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRole = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRole) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (requiredRole.includes(Role.CurrentUser)) {
      if (user.userId == context.switchToHttp().getRequest().params.id) {
        return true;
      }
    }
    const params = context.switchToHttp().getRequest().params;
    params.currentUserId = user.userId; // We set the currentUserId to the params object to have it available in the controller for articles

    const userRoles = user.roles.split(', ');

    return requiredRole.some((role) => userRoles?.includes(role));
  }
}
