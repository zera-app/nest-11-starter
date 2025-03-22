import { Prisma } from '@prisma/client';
import { prisma } from '.';

export function PermissionModel(tx?: Prisma.TransactionClient) {
  const db = tx || prisma;

  return {
    permission: db.permission,
  };
}
