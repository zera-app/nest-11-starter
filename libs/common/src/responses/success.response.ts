export const successResponse = (
  statusCode: number,
  message: string = 'Success',

  data: any,
): {
  code: number;
  success: boolean;
  message: string;
  data: any;
} => {
  const response = {
    code: statusCode,
    success: true,
    message: message,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    data: data,
  };

  return response;
};
