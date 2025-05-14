import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class TokenQueueService {
  private readonly logger = new Logger(TokenQueueService.name);

  constructor(@InjectQueue('token-update-queue') private tokenQueue: Queue) {}

  async addUpdateTokenJob(token: string): Promise<void> {
    try {
      await this.tokenQueue.add('update-token-expiration', { token });
      this.logger.debug(`Added token update job for token: ${token.substring(0, 8)}...`);
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
