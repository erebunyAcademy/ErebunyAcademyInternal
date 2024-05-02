import { SortingType } from '@/api/types/common';

export const orderBy = (sorting: SortingType[]) => {
  let data: Record<string, 'asc' | 'desc'> = {};
  const sortingField = sorting[0].id;
  const sortingDirection = sorting[0].desc ? 'desc' : 'asc';
  data[sortingField] = sortingDirection;

  return data;
};
