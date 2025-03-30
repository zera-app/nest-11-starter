import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { AuthModule } from './auth/auth.module';
import { BullmqModule, CacheModule } from '@app/common';

@Module({
  imports: [AuthModule, CacheModule, BullmqModule],
  controllers: [ClientController],
  providers: [],
})
export class ClientModule {}
