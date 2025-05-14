import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { TokenQueueProcessor } from './processors/token-queue.processor';
import { TokenQueueService } from './services/token-queue.service';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'bull-queue',
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'mail-queue',
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'token-update-queue',
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),
  ],
  controllers: [],
  providers: [TokenQueueProcessor, TokenQueueService],
  exports: [BullModule, TokenQueueService],
})
export class BullmqModule {}
