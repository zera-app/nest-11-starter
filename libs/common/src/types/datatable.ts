export type SortDirection = 'asc' | 'desc';

export type DatatableType = {
  page: number;
  limit: number;
  search: string | null;
  sort: string;
  sortDirection: SortDirection;

  // e.g ?filter[name]=John&filter[age]=30
  filter: Record<string, boolean | string | Date> | null;

  // NOTE: This is just an example, you can add more fields here
  // fields=name,age
  // exclude=name,age
  // include=name,age
};
