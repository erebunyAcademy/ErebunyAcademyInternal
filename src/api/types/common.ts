export type QueryParams = {
  limit: number;
  offset: number;
  sorting: SortingType[];
  search: string;
};

export type SortingType = {
  id: string;
  desc: boolean;
};
