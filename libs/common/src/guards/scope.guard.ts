import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { ApplicationScope } from '@prisma/client';
import { isSuperuser } from './guard-functions';

@Injectable()
export class ScopeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredScopes = this.reflector.get<ApplicationScope[]>('scope', context.getHandler());

    if (!requiredScopes || requiredScopes.length === 0) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (!user.roleNames) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // Check for superuser role - always grant access if user has superuser role
    if (isSuperuser(user)) {
      return true;
    }

    const isPermissionGranted = requiredScopes.some((scope) => user.roleNames?.map((r) => r.name).includes(scope) || scope === ApplicationScope.ALL);

    if (!isPermissionGranted) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
