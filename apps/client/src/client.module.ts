import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@app/common';

@Module({
  imports: [AuthModule, CacheModule],
  controllers: [ClientController],
  providers: [],
})
export class ClientModule {}
