import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { DatatableType, errorResponse, SortDirection, successResponse } from '@app/common';
import { Scope } from '@app/common/decorators/scope.decorator';
import { Response } from 'express';
import { AuthGuard } from '@app/common/guards/auth.guard';
import { ApplicationScope } from '@prisma/client';
import { Role } from '@app/common/decorators/role.decorator';
import { FilterValidationPipe } from '@app/common/pipes/filter-validation.pipe';
import { paginationLength } from '@app/utils/default/pagination-length';
import { defaultSort } from '@app/utils/default/sort';

@Controller('settings/permission')
@UseGuards(AuthGuard)
@Scope(ApplicationScope.BACKEND)
@Role('superuser')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto, @Res() res: Response) {
    try {
      const data = await this.permissionsService.create(createPermissionDto);
      return res.status(201).json(successResponse(201, 'Permissions created successfully', data));
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
      const permissions = await this.permissionsService.findAll(query);
      return res.status(200).json(successResponse(200, 'Permissions retrieved successfully', permissions));
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const permission = await this.permissionsService.findOne(id);
      return res.status(200).json(successResponse(200, 'Permission retrieved successfully', permission));
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto, @Res() res: Response) {
    try {
      const updatedPermission = await this.permissionsService.update(id, updatePermissionDto);
      return res.status(200).json(successResponse(200, 'Permission updated successfully', updatedPermission));
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.permissionsService.remove(id);
      return res.status(200).json(successResponse(200, 'Permission deleted successfully', null));
    } catch (error) {
      return errorResponse(res, error);
    }
  }
}
