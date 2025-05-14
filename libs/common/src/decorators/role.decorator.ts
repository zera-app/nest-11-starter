import { SetMetadata } from '@nestjs/common';

export const Role = (...args: string[]) => SetMetadata('role', args);
