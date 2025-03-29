import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { TokenCleanupModule } from '@app/common';

@Module({
  imports: [AuthModule, TokenCleanupModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
