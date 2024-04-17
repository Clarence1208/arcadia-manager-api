import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";

import { Role } from "./roles.enum";
import { ROLES_KEY } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {} // Inject Reflector

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRole = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRole) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredRole === user.roles;
  }
}
