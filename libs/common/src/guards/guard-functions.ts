import { UserInformation } from '@app/repositories';
import { Request } from 'express';

export const isSuperuser = (user: UserInformation): boolean => {
  if (!user) {
    return false;
  }

  return user.roleNames?.some((role) => role.name === 'superuser') || false;
};

export function extractTokenFromHeader(request: Request): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
