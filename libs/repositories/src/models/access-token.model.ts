import { Prisma } from '@prisma/client';
import { prisma } from '.';
import { accessTokenLifetime } from '@app/utils/default/token-lifetime';
import { DateUtils } from '@app/utils';
import { UnauthorizedException } from '@nestjs/common';

export function AccessTokenModel(tx?: Prisma.TransactionClient) {
  const db = tx || prisma;

  return {
    accessToken: db.accessToken,

    async create(userId: string, token: string, expiresAt: boolean): Promise<{ token: string; expiresAt: Date | null }> {
      return db.accessToken.create({
        data: {
          userId,
          token: token,
          expiresAt: expiresAt ? accessTokenLifetime : null,
        },
      });
    },

    async findToken(token: string): Promise<{ userId: string; id: string; expiresAt: Date | null }> {
      const accessToken = await db.accessToken.findFirst({
        where: { token: token },
      });

      if (!accessToken) {
        throw new UnauthorizedException('Unauthorized');
      }

      if (accessToken.expiresAt !== null) {
        if (DateUtils.isBefore(DateUtils.parse(accessToken.expiresAt.toString()), DateUtils.now())) {
          throw new UnauthorizedException('Unauthorized,');
        }
      }

      return {
        userId: accessToken.userId,
        id: accessToken.id,
        expiresAt: accessToken.expiresAt,
      };
    },

    // async delete(token: string) {
    //   return db.accessToken.delete({
    //     where: { token },
    //   });
    // },
  };
}
