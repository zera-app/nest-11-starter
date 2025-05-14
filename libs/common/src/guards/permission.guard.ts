import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { isSuperuser } from './guard-functions';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredPermissions = this.reflector.get<string[]>('permission', context.getHandler());

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (!user.permissions) {
      throw new ForbiddenException('Insufficient permissions');
    }

    if (isSuperuser(user)) {
      return true;
    }

    const hasRequiredPermission = requiredPermissions.some((permission) => {
      return user.permissions?.map((p) => p).includes(permission);
    });

    if (!hasRequiredPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
