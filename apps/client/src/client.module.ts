import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ClientController],
  providers: [],
})
export class ClientModule {}
