export type PaginationResponse<T> = {
  data: T[];
  page: number;
  limit: number;
  totalCount: number;
};
