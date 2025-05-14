import { Controller } from '@nestjs/common';
import { SelectOptionService } from './select-option.service';

@Controller('select-option')
export class SelectOptionController {
  constructor(private readonly selectOptionService: SelectOptionService) {}
}
