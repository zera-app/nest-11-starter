import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { SelectOptionService } from './select-option.service';
import { errorResponse, successResponse } from '@app/common';
import { Response } from 'express';
import { ApplicationScope } from '@prisma/client';
import { AuthGuard } from '@app/common/guards/auth.guard';
import { ScopeGuard } from '@app/common/guards/scope.guard';
import { Scope } from '@app/common/decorators/scope.decorator';

@Controller('select-option')
@UseGuards(AuthGuard)
@UseGuards(ScopeGuard)
@Scope(ApplicationScope.BACKEND)
export class SelectOptionController {
  constructor(private readonly selectOptionService: SelectOptionService) {}

  @Get('role')
  async selectRole(@Res() res: Response, @Query('scope') scope: ApplicationScope | null = null) {
    try {
      const roles = await this.selectOptionService.selectRole(scope);
      return res.status(200).json(successResponse(200, 'Success get roles', roles));
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  @Get('permissions')
  async selectPermissions(@Res() res: Response) {
    try {
      const permissions = await this.selectOptionService.selectPermissions();
      return res.status(200).json(successResponse(200, 'Success get permissions', permissions));
    } catch (error) {
      return errorResponse(res, error);
    }
  }
}
