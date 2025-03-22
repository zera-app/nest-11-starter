export const successResponse = (
  statusCode: number,
  message: string = 'Success',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
): {
  code: number;
  success: boolean;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
} => {
  const response = {
    code: statusCode,
    success: true,
    message: message,
    data: data,
  };

  return response;
};
