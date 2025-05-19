import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Response } from 'express';
import { DatatableType, errorResponse, SortDirection, successResponse } from '@app/common';
import { paginationLength } from '@app/utils/default/pagination-length';
import { defaultSort } from '@app/utils/default/sort';
import { FilterValidationPipe } from '@app/common/pipes/filter-validation.pipe';
import { AuthGuard } from '@app/common/guards/auth.guard';
import { Scope } from '@app/common/decorators/scope.decorator';
import { ApplicationScope } from '@prisma/client';
import { Role } from '@app/common/decorators/role.decorator';

@Controller('settings/role')
@UseGuards(AuthGuard)
@Scope(ApplicationScope.BACKEND)
@Role('superuser')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto, @Res() res: Response) {
    try {
      const data = await this.roleService.create(createRoleDto);
      return res.status(201).json(successResponse(201, 'Success create role', data));
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  @Get()
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('sort') sort: string,
    @Query('sortDirection') sortDirection: string,
    @Query(new FilterValidationPipe()) filter: Record<string, string | boolean | Date> | null,
    @Res() res: Response,
  ) {
    try {
      const query: DatatableType = {
        page: page || 1,
        limit: limit || paginationLength,
        search: search || null,
        sort: sort || defaultSort,
        sortDirection: (sortDirection === 'asc' ? 'asc' : 'desc') as SortDirection,
        filter: filter || null,
      };

      return res.status(200).json(successResponse(200, 'Success get roles', await this.roleService.findAll(query)));
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      return res.status(200).json(successResponse(200, 'Success get role', await this.roleService.findOne(id)));
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @Res() res: Response) {
    try {
      return res.status(200).json(successResponse(200, 'Success update role', await this.roleService.update(id, updateRoleDto)));
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.roleService.remove(id);
      return res.status(200).json(successResponse(200, 'Success delete role', null));
    } catch (error) {
      return errorResponse(res, error);
    }
  }
}
