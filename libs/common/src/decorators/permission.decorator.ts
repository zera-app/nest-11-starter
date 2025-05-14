import { SetMetadata } from '@nestjs/common';

export const Permission = (...args: string[]) => SetMetadata('permission', args);
