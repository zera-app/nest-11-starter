import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { BullmqModule, CacheModule, TokenCleanupModule } from '@app/common';
import { RoleModule } from './settings/role/role.module';
import { UserModule } from './master/user/user.module';
import { SelectOptionModule } from './select-option/select-option.module';
import { ThrottlerModule } from '@app/common/throttler/throttler.module';
import { PermissionsModule } from './settings/permissions/permissions.module';

@Module({
  imports: [AuthModule, TokenCleanupModule, CacheModule, BullmqModule, RoleModule, UserModule, SelectOptionModule, ThrottlerModule, PermissionsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
