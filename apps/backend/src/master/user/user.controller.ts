import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { DatatableType, errorResponse, SortDirection, successResponse } from '@app/common';
import { AuthGuard } from '@app/common/guards/auth.guard';
import { Scope } from '@app/common/decorators/scope.decorator';
import { ApplicationScope } from '@prisma/client';
import { Permission } from '@app/common/decorators/permission.decorator';
import { paginationLength } from '@app/utils/default/pagination-length';
import { defaultSort } from '@app/utils/default/sort';

@Controller('master/user')
@UseGuards(AuthGuard)
@Scope(ApplicationScope.BACKEND)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Permission('user:create')
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response): Promise<Response> {
    try {
      const data = await this.userService.create(createUserDto);
      return res.status(201).json(successResponse(201, 'Success create user', data));
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  @Get()
  @Permission('user:list')
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('sort') sort: string,
    @Query('sortDirection') sortDirection: string,
    @Query('filter') filter: Record<string, string | boolean | Date> | null,
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

      return res.status(200).json(successResponse(200, 'Success get roles', await this.userService.findAll(query)));
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  @Get(':id')
  @Permission('user:detail')
  async findOne(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    try {
      const data = await this.userService.findOne(id);
      return res.status(200).json(successResponse(200, 'Success get user', data));
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  @Patch(':id')
  @Permission('user:update')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res: Response): Promise<Response> {
    try {
      const data = await this.userService.update(id, updateUserDto);
      return res.status(200).json(successResponse(200, 'Success update user', data));
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  @Delete(':id')
  @Permission('user:delete')
  async remove(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    try {
      await this.userService.remove(id);
      return res.status(200).json(successResponse(200, 'Success delete user', null));
    } catch (error) {
      return errorResponse(res, error);
    }
  }
}
