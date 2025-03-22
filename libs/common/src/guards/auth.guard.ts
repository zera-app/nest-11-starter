import { AccessTokenModel, UserModel } from '@app/repositories';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token: string | undefined = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    const accessTokenData = await AccessTokenModel().findToken(token);
    const user = await UserModel().findUser(accessTokenData.userId);
    request.user = user;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
