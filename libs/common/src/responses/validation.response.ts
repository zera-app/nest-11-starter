import { HttpException } from '@nestjs/common';

export const validationResponse = (error) => {
  const response = {
    code: 422,
    success: false,
    message: 'Unprocessable Entity',
    errors: error,
  };

  return new HttpException(response, 422);
};
