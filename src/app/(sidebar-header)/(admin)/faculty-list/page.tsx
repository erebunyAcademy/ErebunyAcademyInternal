'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { IconButton, Menu, MenuButton, MenuItem, MenuList, useDisclosure } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { BsThreeDots } from 'react-icons/bs';
import { v4 as uuidv4 } from 'uuid';
import { FacultyService } from '@/api/services/faculty.service';
import { UserService } from '@/api/services/user.service';
import SharedAlertDialog from '@/components/molecules/Modals/SharedAlertDialog';
import SearchTable from '@/components/organisms/SearchTable';
import useDebounce from '@/hooks/useDebounce';
import { ITEMS_PER_PAGE } from '@/utils/constants/common';
import { QUERY_KEY } from '@/utils/helpers/queryClient';
import { Maybe } from '@/utils/models/common';
import { FacultyModel } from '@/utils/models/faculty';

export default function Users() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);
  const [selectedStudent, setSelectedStudent] = useState<Maybe<FacultyModel>>(null);

  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose() {
      setSelectedStudent(null);
    },
  });

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: QUERY_KEY.allUsers(debouncedSearch, page),
    queryFn: () =>
      FacultyService.facultyList({
        offset: page === 1 ? 0 : (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        sorting: sorting,
        search: debouncedSearch,
      }),
  });

  const { mutate: deleteUserById } = useMutation({
    mutationFn: UserService.deleteStudentById,
  });

  const { mutate: confirmUserById } = useMutation({
    mutationFn: UserService.confirmUserVerificationById,
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

  const columnHelper = createColumnHelper<FacultyModel>();
  const columns = [
    columnHelper.accessor('title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: 'Title',
    }),
    columnHelper.accessor('description', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: 'Description',
    }),
    columnHelper.accessor('createdAt', {
      id: uuidv4(),
      cell: info => {
        const currentDate = dayjs(info.getValue());
        return currentDate.format('YYYY-MM-DD HH:mm:ss');
      },
      header: 'Created At',
    }),
    columnHelper.accessor('id', {
      id: uuidv4(),
      cell: ({ row }) => (
        <Menu>
          <MenuButton as={IconButton} icon={<BsThreeDots />} />
          <MenuList>
            <MenuItem
              color="green"
              onClick={() => {
                confirmUserById(row.original.id);
              }}>
              Edit
            </MenuItem>
            <MenuItem
              color="red"
              onClick={() => {
                onOpen();
                setSelectedStudent(row.original as FacultyModel);
              }}>
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      ),
      header: 'Actions',
    }),
  ];

  return (
    <>
      <SearchTable
        title="Faculty List"
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
        hasPreviousPage={useMemo(
          () => !(page === 1 || isPlaceholderData),
          [isPlaceholderData, page],
        )}
        fetchNextPage={useCallback(() => setPage(prev => ++prev), [])}
        fetchPreviousPage={useCallback(() => setPage(prev => --prev), [])}
      />
      {isOpen && (
        <SharedAlertDialog
          body={`Are you sure you want to delete ${selectedStudent?.title} student?`}
          isOpen={isOpen}
          title="Delete student"
          isLoading={isLoading}
          deleteFn={() => {
            if (selectedStudent?.id) {
              deleteUserById(selectedStudent.id);
            }
          }}
          onClose={onClose}
        />
      )}
    </>
  );
}
