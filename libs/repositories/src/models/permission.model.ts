import { Prisma } from '@prisma/client';
import { prisma } from '.';
import { DateUtils } from '@app/utils';
import { BadRequestException } from '@nestjs/common';
import { DatatableType, PaginationResponse } from '@app/common';

export function PermissionModel(tx?: Prisma.TransactionClient) {
  const db = tx || prisma;

  return {
    permission: db.permission,

    async findAll(queryParam: DatatableType): Promise<
      PaginationResponse<{
        id: string;
        name: string;
        module: string;
      }>
    > {
      const { page, limit, search, sort, sortDirection } = queryParam;
      const finalLimit = Number(limit);
      const finalPage = Number(page);

      const allowedSort = ['name', 'module', 'createdAt', 'updatedAt'];
      const sortDirectionAllowed = ['asc', 'desc'];
      const allowedFilter = ['name', 'module', 'createdAt', 'updatedAt'];

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
            {
              module: {
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
            ...filter,
            name: {
              contains: queryParam.filter['name'],
              mode: 'insensitive',
            },
          };
        }

        if (queryParam.filter['module']) {
          filter = {
            ...filter,
            module: {
              contains: queryParam.filter['module'],
              mode: 'insensitive',
            },
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

      const data = await db.permission.findMany({
        where,
        select: {
          id: true,
          name: true,
          module: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          [sort]: sortDirection,
        },
        skip: (finalPage - 1) * finalLimit,
        take: finalLimit,
      });

      const total = await db.permission.count({
        where,
      });

      return {
        data,
        page: page,
        limit: limit,
        totalCount: total,
      };
    },

    async selectPermissions(): Promise<{ module: string; permissions: { id: string; name: string }[] }[]> {
      const permissions = await prisma.permission.findMany({
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

      const groupedByModule = permissions.reduce(
        (acc, permission) => {
          const { module, id, name } = permission;
          const existingModule = acc.find((item) => item.module === module);

          if (existingModule) {
            existingModule.permissions.push({ id, name });
          } else {
            acc.push({ module, permissions: [{ id, name }] });
          }
          return acc;
        },
        [] as { module: string; permissions: { id: string; name: string }[] }[],
      );

      return groupedByModule;
    },
  };
}
