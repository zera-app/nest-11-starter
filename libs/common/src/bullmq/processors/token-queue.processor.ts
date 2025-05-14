import { AccessTokenModel } from '@app/repositories';
import { DateUtils } from '@app/utils';
import { accessTokenLifetime } from '@app/utils/default/token-lifetime';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('token-update-queue')
export class TokenQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(TokenQueueProcessor.name);

  async process(job: Job<{ token: string }>): Promise<void> {
    try {
      const { token } = job.data;

      // Find the token in the database
      const accessToken = await AccessTokenModel().accessToken.findFirst({
        where: { token },
      });

      if (accessToken) {
        // Update the token expiration in database
        await AccessTokenModel().accessToken.update({
          where: { id: accessToken.id },
          data: {
            expiresAt: accessToken.expiresAt === null ? null : accessTokenLifetime,
            lastUsedAt: DateUtils.now().format(),
          },
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Failed to add token update job: ${error.message}`, error.stack);
      } else {
        this.logger.error(`Failed to add token update job: ${String(error)}`);
      }

      throw error;
    }
  }
}
