import { PrismaClient } from '@prisma/client';

export * from './user.model';
export * from './role.model';
export * from './permission.model';
export * from './email-verification.model';
export * from './access-token.model';
export * from './reset-token.model';

export const prisma = new PrismaClient();
