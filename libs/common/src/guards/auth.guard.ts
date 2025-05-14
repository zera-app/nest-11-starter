import { DateUtils, EncryptionUtils } from '@app/utils';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthCacheService } from '../cache/auth-cache.service';
import { AccessTokenModel, UserModel } from '@app/repositories';
import { TokenQueueService } from '../bullmq/services/token-queue.service';
import { extractTokenFromHeader } from './guard-functions';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authCacheService: AuthCacheService,
    private readonly tokenQueueService: TokenQueueService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const bearerToken: string | undefined = extractTokenFromHeader(request);
    if (!bearerToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    const token = EncryptionUtils.decrypt(bearerToken);

    // Always fetch fresh token data from database
    const accessTokenData = await AccessTokenModel().findToken(token);
    if (!accessTokenData || !accessTokenData.userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (accessTokenData.expiresAt !== null) {
      if (DateUtils.isBefore(DateUtils.parse(accessTokenData.expiresAt.toString()), DateUtils.now())) {
        throw new UnauthorizedException('Unauthorized');
      }
    }

    // Try to get user from cache first
    // If not in cache, fetch from database and cache it
    let userInformation = await this.authCacheService.getUserInfo(accessTokenData.userId);
    if (!userInformation) {
      userInformation = await UserModel().findUser(accessTokenData.userId);
      if (!userInformation) {
        throw new UnauthorizedException('Unauthorized');
      }

      // Store user in cache
      await this.authCacheService.setUserInfo(userInformation.id, userInformation);
    }

    // Queue a job to update the token expiration in background
    // This happens regardless of whether we got user from cache or database
    if (accessTokenData.expiresAt !== null) {
      await this.tokenQueueService.addUpdateTokenJob(token);
    }

    // Attach user to request
    request.user = userInformation;

    return true;
  }
}
