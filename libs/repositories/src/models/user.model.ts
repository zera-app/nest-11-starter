import { Prisma } from '@prisma/client';
import { prisma } from '.';
import { NotFoundException } from '@nestjs/common';
import { HashUtils } from '@app/utils';

export type UserInformation = {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export function UserModel(tx?: Prisma.TransactionClient) {
  const db = tx || prisma;

  return {
    user: db.user,

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
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    },
  };
}
