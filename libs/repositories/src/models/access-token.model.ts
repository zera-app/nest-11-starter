import { Prisma } from '@prisma/client';
import { prisma } from '.';
import { accessTokenLifetime } from '@app/utils/default/token-lifetime';
import { DateUtils, EncryptionUtils } from '@app/utils';
import { UnauthorizedException } from '@nestjs/common';

export function AccessTokenModel(tx?: Prisma.TransactionClient) {
  const db = tx || prisma;

  return {
    accessToken: db.accessToken,

    async create(
      userId: string,
      token: string,
      expiresAt: boolean,
    ): Promise<{ token: string }> {
      return db.accessToken.create({
        data: {
          userId,
          token: EncryptionUtils.decrypt(token),
          expiresAt: expiresAt ? accessTokenLifetime : null,
        },
      });
    },

    async findToken(token: string): Promise<{ userId: string; id: string }> {
      const decryptedToken = EncryptionUtils.decrypt(token);
      const accessToken = await db.accessToken.findFirst({
        where: { token: decryptedToken },
      });

      if (!accessToken) {
        throw new UnauthorizedException('Unauthorized');
      }

      if (accessToken.expiresAt !== null) {
        if (
          DateUtils.isBefore(
            DateUtils.parse(accessToken.expiresAt.toString()),
            DateUtils.now(),
          )
        ) {
          throw new UnauthorizedException('Unauthorized');
        }
      }

      return { userId: accessToken.userId, id: accessToken.id };
    },

    // async delete(token: string) {
    //   return db.accessToken.delete({
    //     where: { token },
    //   });
    // },
  };
}
