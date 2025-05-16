import { Prisma } from '@prisma/client';
import { prisma } from '.';

export function PermissionModel(tx?: Prisma.TransactionClient) {
  const db = tx || prisma;

  return {
    permission: db.permission,
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
