import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { AnyZodObject } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: AnyZodObject) {}

  transform(value: any) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      // you can format this error any way you like
      throw new BadRequestException(result.error.format());
    }
    return result.data;
  }
}
