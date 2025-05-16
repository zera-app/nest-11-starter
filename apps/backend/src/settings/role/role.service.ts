import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PermissionModel, prisma, RoleModel } from '@app/repositories';
import { DatatableType, PaginationResponse } from '@app/common';

@Injectable()
export class RoleService {
  async create(createRoleDto: CreateRoleDto): Promise<{
    id: string;
    name: string;
    scope: string;
    permissions: {
      id: string;
      name: string;
      module: string;
    }[];
  }> {
    const data = await prisma.$transaction(async (prisma) => {
      const role = await RoleModel(prisma).create({
        name: createRoleDto.name,
        scope: createRoleDto.scope,
      });

      await RoleModel(prisma).assignPermissions(role.id, createRoleDto.permissionIds);

      return await RoleModel(prisma).findOne(role.id);
    });

    if (!data) {
      throw new NotFoundException('Role not found');
    }

    return data;
  }

  async findAll(query: DatatableType): Promise<
    PaginationResponse<{
      id: string;
      name: string;
      scope: string;
    }>
  > {
    return await RoleModel().findAll(query);
  }

  async findOne(id: string): Promise<{
    roleInformation: {
      id: string;
      name: string;
      scope: string;
      permissions: {
        id: string;
        name: string;
        module: string;
      }[];
    };
    permissions: {
      module: string;
      permissions: { id: string; name: string }[];
    }[];
  }> {
    const data = await RoleModel().findOneWithAssignedPermissions(id);

    if (!data) {
      throw new NotFoundException('Role not found');
    }

    const permissions = await PermissionModel().selectPermissions();

    return {
      roleInformation: data,
      permissions,
    };
  }

  async update(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<{
    id: string;
    name: string;
    scope: string;
    permissions: {
      id: string;
      name: string;
      module: string;
    }[];
  }> {
    const data = await prisma.$transaction(async (prisma) => {
      const role = await RoleModel(prisma).role.findUnique({
        where: {
          id: id,
          NOT: {
            name: 'superuser',
          },
        },
      });

      if (!role) {
        throw new NotFoundException('Role not found');
      }

      await RoleModel(prisma).role.update({
        where: {
          id: id,
        },
        data: {
          name: updateRoleDto.name,
          scope: updateRoleDto.scope,
        },
      });

      await RoleModel(prisma).assignPermissions(role.id, updateRoleDto.permissionIds ?? []);

      return await RoleModel(prisma).findOne(role.id);
    });

    if (!data) {
      throw new NotFoundException('Role not found');
    }

    return data;
  }

  async remove(id: string): Promise<void> {
    await prisma.$transaction(async (prisma) => {
      const role = await RoleModel(prisma).role.findUnique({
        where: {
          id: id,
          NOT: {
            name: 'superuser',
          },
        },
      });

      if (!role) {
        throw new NotFoundException('Role not found');
      }

      await RoleModel(prisma).delete(role.id);
    });
  }
}
