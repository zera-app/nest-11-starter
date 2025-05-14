import { prisma } from '@app/repositories';

export async function seedPermission() {
  const moduleNames = ['user', 'role'];
  const actionNames = ['list', 'create', 'detail', 'update', 'delete'];

  moduleNames.map(async (module) => {
    actionNames.map(async (action) => {
      await prisma.permission.create({
        data: {
          name: `${module}:${action}`,
          module,
        },
      });
    });
  });
}
