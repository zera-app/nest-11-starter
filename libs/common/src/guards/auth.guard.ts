import { AccessTokenModel, UserModel } from '@app/repositories';
import { DateUtils, EncryptionUtils } from '@app/utils';
import { accessTokenLifetime } from '@app/utils/default/token-lifetime';
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

    const decryptedToken = EncryptionUtils.decrypt(token);
    const accessTokenData = await AccessTokenModel().findToken(decryptedToken);
    const user = await UserModel().findUser(accessTokenData.userId);
    request.user = user;

    await AccessTokenModel().accessToken.update({
      where: {
        id: accessTokenData.id,
      },
      data: {
        expiresAt:
          accessTokenData.expiresAt === null ? null : accessTokenLifetime,
        lastUsedAt: DateUtils.now().format(),
      },
    });

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
