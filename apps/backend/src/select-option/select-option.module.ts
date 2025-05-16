import { Module } from '@nestjs/common';
import { SelectOptionService } from './select-option.service';
import { SelectOptionController } from './select-option.controller';

@Module({
  controllers: [SelectOptionController],
  providers: [SelectOptionService],
})
export class SelectOptionModule {}
