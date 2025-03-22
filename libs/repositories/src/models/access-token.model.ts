import { Prisma } from '@prisma/client';
import { prisma } from '.';

export function AccessTokenModel(tx?: Prisma.TransactionClient) {
  const db = tx || prisma;

  return {
    accessToken: db.accessToken,
  };
}
