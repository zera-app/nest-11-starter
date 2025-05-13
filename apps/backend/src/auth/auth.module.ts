import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CacheModule } from '@app/common';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [CacheModule],
})
export class AuthModule {}
