import { Prisma } from '@prisma/client';
import { prisma } from '.';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { DatatableType, PaginationResponse } from '@app/common';
import { DateUtils } from '@app/utils';

export function RoleModel(tx?: Prisma.TransactionClient) {
  const db = tx || prisma;

  return {
    role: db.role,

    async findAll(queryParam: DatatableType): Promise<
      PaginationResponse<{
        id: string;
        name: string;
        scope: string;
      }>
    > {
      const { page, limit, search, sort, sortDirection } = queryParam;
      const finalLimit = Number(limit);
      const finalPage = Number(page);

      const allowedSort = ['name', 'scope', 'createdAt', 'updatedAt'];
      const sortDirectionAllowed = ['asc', 'desc'];
      const allowedFilter = ['name', 'createdAt', 'updatedAt'];

      if (!allowedSort.includes(sort)) {
        throw new BadRequestException('Invalid sort field');
      }

      if (!sortDirectionAllowed.includes(sortDirection)) {
        throw new BadRequestException('Invalid sort direction');
      }

      if (queryParam.filter) {
        const filterKeys = Object.keys(queryParam.filter);
        for (const key of filterKeys) {
          if (!allowedFilter.includes(key)) {
            throw new BadRequestException('Invalid filter field');
          }
        }
      }

      let where = {};
      if (search) {
        where = {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        };
      }

      let filter = {};
      if (queryParam.filter) {
        if (queryParam.filter['name']) {
          filter = {
            OR: [
              {
                name: {
                  contains: queryParam.filter['name'],
                  mode: 'insensitive',
                },
              },
            ],
          };
        }

        if (queryParam.filter['createdAt'] && typeof queryParam.filter['createdAt'] === 'string') {
          const [startDate, endDate] = queryParam.filter['createdAt'].split(',');
          filter = {
            ...filter,
            createdAt: {
              gte: DateUtils.parse(startDate),
              ...(endDate && { lte: DateUtils.parse(endDate) }),
            },
          };
        }

        if (queryParam.filter['updatedAt'] && typeof queryParam.filter['updatedAt'] === 'string') {
          const [startDate, endDate] = queryParam.filter['updatedAt'].split(',');
          filter = {
            ...filter,
            updatedAt: {
              gte: DateUtils.parse(startDate),
              ...(endDate && { lte: DateUtils.parse(endDate) }),
            },
          };
        }

        where = {
          ...where,
          ...filter,
        };
      }

      console.log(where);
      console.log(queryParam);

      const data = await db.role.findMany({
        where: {
          ...where,
          NOT: {
            name: 'superuser',
          },
        },
        select: {
          id: true,
          name: true,
          scope: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          [sort]: sortDirection,
        },
        skip: (finalPage - 1) * finalLimit,
        take: finalLimit,
      });

      const total = await db.role.count({
        where: {
          ...where,
          NOT: {
            name: 'superuser',
          },
        },
      });

      return {
        data,
        page: page,
        limit: limit,
        totalCount: total,
      };
    },

    async create(data: Prisma.RoleCreateInput) {
      return await db.role.create({
        data: {
          ...data,
        },
      });
    },

    async findOne(id: string): Promise<{
      id: string;
      name: string;
      scope: string;
      permissions: {
        id: string;
        name: string;
        module: string;
      }[];
    }> {
      const data = await RoleModel(db).role.findUnique({
        where: {
          id: id,
        },
        select: {
          id: true,
          name: true,
          scope: true,
          permissions: {
            include: {
              permission: {
                select: {
                  id: true,
                  name: true,
                  module: true,
                },
              },
            },
          },
        },
      });

      if (!data) {
        throw new NotFoundException('Role not found');
      }

      return {
        id: data.id,
        name: data.name,
        scope: data.scope,
        permissions: data.permissions.map((permission) => ({
          id: permission.permission.id,
          name: permission.permission.name,
          module: permission.permission.module,
        })),
      };
    },

    async findOneWithAssignedPermissions(id: string): Promise<{
      id: string;
      name: string;
      scope: string;
      permissions: {
        id: string;
        name: string;
        module: string;
        isAssigned: boolean;
      }[];
    }> {
      const data = await RoleModel(db).role.findUnique({
        where: {
          id: id,
        },
        select: {
          id: true,
          name: true,
          scope: true,
          permissions: {
            select: {
              permission: {
                select: {
                  id: true,
                  name: true,
                  module: true,
                },
              },
            },
          },
        },
      });

      if (!data) {
        throw new NotFoundException('Role not found');
      }

      const permissions = await db.permission.findMany({
        select: {
          id: true,
          name: true,
          module: true,
        },
        orderBy: [
          {
            module: 'asc',
          },
          {
            name: 'asc',
          },
        ],
      });

      return {
        id: data.id,
        name: data.name,
        scope: data.scope,
        permissions: permissions.map((permission) => ({
          id: permission.id,
          name: permission.name,
          module: permission.module,
          isAssigned: data.permissions.some((assignedPermission) => assignedPermission.permission.id === permission.id),
        })),
      };
    },

    async assignPermissions(roleId: string, permissionIds: string[]) {
      await db.rolePermission.deleteMany({
        where: {
          roleId: roleId,
        },
      });

      return await db.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({
          roleId: roleId,
          permissionId: permissionId,
        })),
      });
    },

    async delete(id: string): Promise<void> {
      const role = await db.role.findUnique({
        where: {
          id: id,
        },
      });

      if (!role) {
        throw new NotFoundException('Role not found');
      }

      if (role.name === 'superuser') {
        throw new ForbiddenException('Cannot delete superuser role');
      }

      await db.role.delete({
        where: {
          id: id,
        },
      });
    },
  };
}
