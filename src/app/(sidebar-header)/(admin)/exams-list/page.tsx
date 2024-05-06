'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { BsThreeDots } from 'react-icons/bs';
import { ExamService } from '@/api/services/exam.service';
import { StudentService } from '@/api/services/student.service';
import SearchTable from '@/components/organisms/SearchTable';
import useDebounce from '@/hooks/useDebounce';
import { ITEMS_PER_PAGE } from '@/utils/constants/common';
import { ROUTE_EXAMS } from '@/utils/constants/routes';
import { QUERY_KEY } from '@/utils/helpers/queryClient';
import { UserModel } from '@/utils/models/user';

export default function Exams() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEY.allUsers(debouncedSearch, page),
    queryFn: () =>
      StudentService.list({
        offset: page === 1 ? 0 : (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        sorting: sorting,
        search: debouncedSearch,
      }),
  });

  const { mutate } = useMutation({
    mutationFn: ExamService.createExam,
    onSuccess: res => {
      router.push(`${ROUTE_EXAMS}/${res.id}`);
    },
  });

  const pageCount = useMemo(
    () => (data?.count ? Math.ceil(data.count / ITEMS_PER_PAGE) : undefined),
    [data?.count],
  );

  const setSearchValue = (value: string) => {
    setPage(prev => (value && prev !== 1 ? 1 : prev));
    setSearch(value);
  };

  const columnHelper = createColumnHelper<UserModel>();
  const columns: any = useMemo(
    () => [
      columnHelper.accessor('firstName', { header: 'First Name' }),
      columnHelper.accessor('lastName', { header: 'Last Name' }),
      columnHelper.accessor('email', { header: 'Email' }),
      columnHelper.accessor('createdAt', {
        header: 'Created At',
        cell: info => dayjs(info.getValue()).format('YYYY-MM-DD HH:mm:ss'),
      }),
      columnHelper.accessor('id', {
        header: 'Actions',
        cell: ({ row }) => (
          <Menu>
            <MenuButton as={IconButton} icon={<BsThreeDots />} />
            <MenuList>
              <MenuItem onClick={() => console.log({ row })}>Confirm</MenuItem>
              <MenuItem>Delete</MenuItem>
            </MenuList>
          </Menu>
        ),
      }),
    ],
    [columnHelper],
  );

  const addNewExamHandler = useCallback(() => {
    mutate();
  }, [mutate]);

  return (
    <SearchTable
      title="Users List"
      isLoading={isLoading}
      data={data?.users || []}
      count={data?.count || 0}
      columns={columns}
      sorting={sorting}
      addNew={addNewExamHandler}
      search={search}
      setSorting={setSorting}
      setSearch={setSearchValue}
      hasNextPage={!pageCount || page < pageCount}
      hasPreviousPage={page > 1}
      fetchNextPage={() => setPage(prev => ++prev)}
      fetchPreviousPage={() => setPage(prev => --prev)}
    />
  );
}
