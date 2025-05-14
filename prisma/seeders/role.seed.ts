import { prisma } from '@app/repositories';
import { ApplicationScope } from '@prisma/client';

export async function seedRole() {
  const roleNames = ['superuser', 'admin', 'user'];

  const permissionIds = await prisma.permission.findMany({
    select: {
      id: true,
    },
  });

  const permissionAdminIds = await prisma.permission.findMany({
    where: {
      NOT: {
        name: {
          contains: 'role',
        },
      },
    },
    select: {
      id: true,
    },
  });

  roleNames.map(async (name) => {
    // set the role scope
    // the role scope is set to all by default
    var scope: ApplicationScope = ApplicationScope.ALL;
    if (name === 'admin') {
      scope = ApplicationScope.BACKEND;
    } else if (name === 'user') {
      scope = ApplicationScope.CLIENT;
    }

    const role = await prisma.role.create({
      data: {
        name,
        scope,
      },
    });

    if (name === 'superuser') {
      permissionIds.map(async (permissionId) => {
        await prisma.rolePermission.create({
          data: {
            roleId: role.id,
            permissionId: permissionId.id,
          },
        });
      });
    }

    if (name === 'admin') {
      permissionAdminIds.map(async (permissionId) => {
        await prisma.rolePermission.create({
          data: {
            roleId: role.id,
            permissionId: permissionId.id,
          },
        });
      });
    }
  });
}
