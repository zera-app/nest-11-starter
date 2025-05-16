import { ApplicationScope, Prisma } from '@prisma/client';
import { prisma } from '.';
import { BadRequestException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { DateUtils, HashUtils } from '@app/utils';
import { DatatableType, PaginationResponse } from '@app/common';

export type UserInformation = {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  roleNames?: {
    name: string;
    scope: ApplicationScope;
  }[];
  permissions?: string[];
};

export function UserModel(tx?: Prisma.TransactionClient) {
  const db = tx || prisma;

  return {
    user: db.user,

    async findAll(queryParam: DatatableType): Promise<
      PaginationResponse<{
        id: string;
        name: string | null;
        email: string;
        createdAt: Date;
        updatedAt: Date;
      }>
    > {
      const { page, limit, search, sort, sortDirection } = queryParam;
      const finalLimit = Number(limit);
      const finalPage = Number(page);

      const allowedSort = ['name', 'email', 'createdAt', 'updatedAt'];
      const sortDirectionAllowed = ['asc', 'desc'];
      const allowedFilter = ['name', 'email', 'createdAt', 'updatedAt'];

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
              email: {
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

        if (queryParam.filter['email']) {
          filter = {
            ...filter,
            OR: [
              {
                email: {
                  contains: queryParam.filter['email'],
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
      const data = await db.user.findMany({
        where: {
          ...where,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          [sort]: sortDirection,
        },
        skip: (finalPage - 1) * finalLimit,
        take: finalLimit,
      });

      const total = await db.user.count({
        where: {
          ...where,
        },
      });

      return {
        data,
        page: page,
        limit: limit,
        totalCount: total,
      };
    },

    async create(
      data: Prisma.UserCreateInput,
      roleIds: string[] | null,
    ): Promise<{
      id: string;
      name: string | null;
      email: string;
      createdAt: Date;
      updatedAt: Date;
    }> {
      const isEmailExist = await db.user.findUnique({
        where: {
          email: data.email,
        },
      });
      if (isEmailExist) {
        throw new UnprocessableEntityException({
          message: 'Email already exists',
          error: {
            email: ['Email already exists'],
          },
        });
      }

      const user = await db.user.create({
        data: {
          ...data,
          password: await HashUtils.generateHash(data.password),
        },
      });

      if (roleIds) {
        await this.assignRoles(user.id, roleIds);
      }

      return await this.findOne(user.id);
    },

    async findOne(id: string): Promise<{
      id: string;
      name: string | null;
      email: string;
      createdAt: Date;
      updatedAt: Date;
      roles: {
        id: string;
        name: string;
        scope: ApplicationScope;
      }[];
    }> {
      const user = await db.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          roles: {
            include: {
              role: {
                select: {
                  id: true,
                  name: true,
                  scope: true,
                },
              },
            },
          },
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const roles = user.roles.map((role) => ({
        id: role.role.id,
        name: role.role.name,
        scope: role.role.scope,
      }));

      return {
        ...user,
        roles: roles,
      };
    },

    async update(
      id: string,
      data: {
        name: string | null;
        email: string;
        password?: string;
      },
      roleIds: string[] | null,
    ): Promise<{
      id: string;
      name: string | null;
      email: string;
      createdAt: Date;
      updatedAt: Date;
    }> {
      // check if email already exists
      const isEmailExist = await db.user.findUnique({
        where: {
          email: data.email,
          NOT: {
            id: id,
          },
        },
      });
      if (isEmailExist) {
        throw new UnprocessableEntityException({
          message: 'Email already belongs to another user',
          error: {
            email: ['Email already belongs to another user'],
          },
        });
      }

      // check if user exists
      const userExists = await db.user.findUnique({
        where: { id },
      });
      if (!userExists) {
        throw new NotFoundException('User not found');
      }

      const user = await db.user.update({
        where: { id },
        data: {
          ...data,
          password: data.password ? await HashUtils.generateHash(data.password) : undefined,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (roleIds) {
        await this.assignRoles(user.id, roleIds);
      }

      return await this.findOne(user.id);
    },

    async remove(id: string): Promise<void> {
      const user = await db.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await db.user.delete({
        where: { id },
      });
    },

    async assignRoles(id: string, roleIds: string[]): Promise<void> {
      const roles = await db.role.findMany({
        where: {
          id: {
            in: roleIds,
          },
        },
      });

      if (roles.length !== roleIds.length) {
        throw new NotFoundException('Role not found');
      }

      const user = await this.findOne(id);

      await db.roleUser.deleteMany({
        where: {
          userId: user.id,
        },
      });

      await db.roleUser.createMany({
        data: roleIds.map((roleId) => ({
          userId: user.id,
          roleId,
        })),
      });
    },

    async checkPassword(id: string, password: string): Promise<boolean> {
      const user = await db.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return await HashUtils.compareHash(password, user.password);
    },

    // please don't change this function below, this for authentication purpose
    async findUser(id: string): Promise<UserInformation> {
      const user = await db.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          roles: {
            include: {
              role: {
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
              },
            },
          },
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const permissions = user.roles.flatMap((role) => role.role.permissions.map((permission) => permission.permission.name));

      const roleNames = user.roles.map((role) => {
        const scopeName = role.role.scope;
        return {
          name: role.role.name,
          scope: scopeName,
        };
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        roleNames,
        permissions,
      };
    },
  };
}
