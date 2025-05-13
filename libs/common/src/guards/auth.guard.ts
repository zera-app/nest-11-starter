import { DateUtils, EncryptionUtils } from '@app/utils';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthCacheService } from '../cache/auth-cache.service';
import { AccessTokenModel, UserModel } from '@app/repositories';
import { accessTokenLifetime } from '@app/utils/default/token-lifetime';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authCacheService: AuthCacheService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token: string | undefined = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    const decryptedToken = EncryptionUtils.decrypt(token);

    const cacheKey = this.authCacheService.generateCacheKey(decryptedToken);
    const cache = await this.authCacheService.get(cacheKey);

    let userInformation = cache?.userInformation;
    if (!userInformation) {
      const accessTokenData = await AccessTokenModel().findToken(decryptedToken);
      userInformation = await UserModel().findUser(accessTokenData.userId);

      await AccessTokenModel().accessToken.update({
        where: {
          id: accessTokenData.id,
        },
        data: {
          expiresAt: accessTokenData.expiresAt === null ? null : accessTokenLifetime,
          lastUsedAt: DateUtils.now().format(),
        },
      });
    } else {
      const tokenInformation = cache?.tokenInformation;
      if (tokenInformation === null) {
        await this.authCacheService.del(cacheKey);
        throw new UnauthorizedException('Unauthorized');
      }

      if (tokenInformation) {
        if (tokenInformation.expiresAt !== null) {
          if (DateUtils.isBefore(DateUtils.parse(tokenInformation.expiresAt.toString()), DateUtils.now())) {
            await this.authCacheService.del(cacheKey);
            throw new UnauthorizedException('Unauthorized');
          }
        }
      } else {
        await this.authCacheService.del(cacheKey);
        throw new UnauthorizedException('Unauthorized');
      }
    }

    request.user = userInformation;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
