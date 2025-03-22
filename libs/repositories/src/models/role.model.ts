import { Prisma } from '@prisma/client';
import { prisma } from '.';

export function RoleModel(tx?: Prisma.TransactionClient) {
  const db = tx || prisma;

  return {
    role: db.role,
  };
}
