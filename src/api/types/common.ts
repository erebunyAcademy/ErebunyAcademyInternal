export type QueryParams = {
  limit: number;
  offset: number;
  sortBy?: string;
  orderBy?: string;
  search: string;
};

export type SortingType = {
  [key: string]: string;
};
