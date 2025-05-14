import { SetMetadata } from '@nestjs/common';
import { ApplicationScope } from '@prisma/client';

export const Scope = (...args: ApplicationScope[]) => SetMetadata('scope', args);
