import { HttpException } from '@nestjs/common';

export const validationResponse = (error: any) => {
  const response = {
    code: 422,
    success: false,
    message: 'Unprocessable Entity',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    errors: error,
  };

  return new HttpException(response, 422);
};
