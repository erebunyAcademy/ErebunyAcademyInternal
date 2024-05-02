'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from '@/api/services/user.service';
import SearchTable from '@/components/organisms/SearchTable';
import useDebounce from '@/hooks/useDebounce';
import { ITEMS_PER_PAGE } from '@/utils/constants/common';
import { QUERY_KEY } from '@/utils/helpers/queryClient';
import { UserModel } from '@/utils/models/user';

export default function Users() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: QUERY_KEY.allUsers(debouncedSearch, page),
    queryFn: () =>
      UserService.getAllUsers({
        offset: page === 1 ? 0 : (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        sorting: sorting,
        search: debouncedSearch,
      }),
  });

  const pageCount = useMemo(() => {
    if (data?.count) {
      return Math.ceil(data.count / ITEMS_PER_PAGE);
    }
  }, [data?.count]);

  const setSearchValue = useCallback(
    (value: string) => {
      if (!!value && page !== 1) {
        setPage(1);
      }
      setSearch(value);
    },
    [page],
  );

  const columnHelper = useMemo(() => createColumnHelper<UserModel>(), []);
  const columns = useMemo(
    () => [
      columnHelper.accessor('firstName', {
        id: uuidv4(),
        cell: info => info.getValue(),
        header: 'First Name',
      }),
      columnHelper.accessor('lastName', {
        id: uuidv4(),
        cell: info => info.getValue(),
        header: 'Last Name',
      }),
      columnHelper.accessor('email', {
        id: uuidv4(),
        cell: info => info.getValue(),
        header: 'Email',
      }),
      columnHelper.accessor('createdAt', {
        id: uuidv4(),
        cell: info => {
          const currentDate = dayjs(info.getValue());
          return currentDate.format('YYYY-MM-DD HH:mm:ss');
        },
        header: 'Created At',
      }),
    ],
    [columnHelper],
  );

  return (
    <SearchTable
      title="Users List"
      isLoading={isLoading}
      data={data?.users || []}
      count={data?.count || 0}
      // @ts-ignore
      columns={columns}
      sorting={sorting}
      search={search}
      setSorting={setSorting}
      setSearch={setSearchValue}
      hasNextPage={useMemo(
        () => !(!pageCount || page === pageCount || isPlaceholderData),
        [isPlaceholderData, page, pageCount],
      )}
      hasPreviousPage={useMemo(() => !(page === 1 || isPlaceholderData), [isPlaceholderData, page])}
      fetchNextPage={useCallback(() => setPage(prev => ++prev), [])}
      fetchPreviousPage={useCallback(() => setPage(prev => --prev), [])}
    />
  );
}
