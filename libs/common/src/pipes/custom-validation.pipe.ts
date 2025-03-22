import {
  Injectable,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors = formatErrors(errors);
        const firstMessage =
          Object.values(formattedErrors)[0]?.[0] || 'Validation Failed';
        return new UnprocessableEntityException({
          statusCode: 422,
          message: firstMessage,
          errors: formattedErrors,
        });
      },
    });
  }
}

function formatErrors(
  errors: ValidationError[],
  parentField = '',
): Record<string, string[]> {
  const formattedErrors: Record<string, string[]> = {};

  errors.forEach((error) => {
    const field = parentField
      ? `${parentField}.${error.property}`
      : error.property;

    if (error.constraints) {
      formattedErrors[field] = Object.values(error.constraints);
    }

    if (error.children?.length) {
      const childErrors = formatErrors(error.children, field);
      Object.assign(formattedErrors, childErrors);
    }
  });

  return formattedErrors;
}
