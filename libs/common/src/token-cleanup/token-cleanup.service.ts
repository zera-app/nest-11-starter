import { AccessTokenModel, prisma } from '@app/repositories';
import { DateUtils } from '@app/utils';
import { autoDeleteTokenLifetime } from '@app/utils/default/token-lifetime';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TokenCleanupService {
  @Cron('0 0 * * *') // every day at midnight
  // @Cron('*/1 * * * *') // every 1 minute for testing
  async tokenCleanUp(): Promise<void> {
    {
      console.log('Token cleanup executed');

      prisma.$transaction(async (prisma) => {
        await AccessTokenModel(prisma).accessToken.deleteMany({
          where: {
            expiresAt: {
              lte: DateUtils.now().toDate(),
            },
          },
        });

        await AccessTokenModel(prisma).accessToken.deleteMany({
          where: {
            lastUsedAt: {
              lte: autoDeleteTokenLifetime,
            },
          },
        });
      });

      console.log('Token cleanup completed');
    }
  }
}
