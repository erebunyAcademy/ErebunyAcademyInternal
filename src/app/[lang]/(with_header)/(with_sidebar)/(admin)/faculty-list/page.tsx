'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { Box, MenuItem, useDisclosure } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { v4 as uuidv4 } from 'uuid';
import { FacultyService } from '@/api/services/faculty.service';
import ActionButtons from '@/components/molecules/ActionButtons';
import SearchTable from '@/components/organisms/SearchTable';
import useDebounce from '@/hooks/useDebounce';
import { ITEMS_PER_PAGE } from '@/utils/constants/common';
import { QUERY_KEY } from '@/utils/helpers/queryClient';
import { Maybe } from '@/utils/models/common';
import { FacultyModel } from '@/utils/models/faculty';

const DeleteModal = dynamic(() => import('./_components/modals/DeleteModal'));
const CreateEditModal = dynamic(() => import('./_components/modals/CreateEditModal'));

const Faculty = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);
  const [selectedFaculty, setSelectedFaculty] = useState<Maybe<FacultyModel>>(null);
  const t = useTranslations();

  const {
    isOpen: isCreateEditModalOpen,
    onOpen: openCreateEditModal,
    onClose: closeCreateEditModal,
  } = useDisclosure({
    onClose() {
      setSelectedFaculty(null);
    },
  });

  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal,
  } = useDisclosure({
    onClose() {
      setSelectedFaculty(null);
    },
  });

  const { data, isLoading, isPlaceholderData, refetch } = useQuery({
    queryKey: QUERY_KEY.allFaculties(debouncedSearch, page),
    queryFn: () =>
      FacultyService.facultyList({
        offset: page === 1 ? 0 : (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
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

  const columnHelper = createColumnHelper<FacultyModel>();
  const columns = [
    columnHelper.accessor('title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('title'),
    }),
    columnHelper.accessor('description', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('description'),
    }),
    columnHelper.accessor('id', {
      id: uuidv4(),
      cell: ({ row }) => (
        <ActionButtons>
          <MenuItem
            color="green"
            onClick={() => {
              setSelectedFaculty(row.original);
              openCreateEditModal();
            }}>
            {t('edit')}
          </MenuItem>
          <MenuItem
            color="red"
            onClick={() => {
              setSelectedFaculty(row.original);
              openDeleteModal();
            }}>
            {t('delete')}
          </MenuItem>
        </ActionButtons>
      ),
      header: t('actions'),
    }),
  ];

  const addNewFacultyHandler = useCallback(() => {
    openCreateEditModal();
  }, [openCreateEditModal]);

  return (
    <>
      <Box width="30px" height="30px" bg="pink"></Box>
      <SearchTable
        title="facultyList"
        isLoading={isLoading}
        data={data?.faculties || []}
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
        addNew={addNewFacultyHandler}
      />
      {isCreateEditModalOpen && (
        <CreateEditModal
          selectedFaculty={selectedFaculty}
          isCreateEditModalOpen={isCreateEditModalOpen}
          closeCreateEditModal={closeCreateEditModal}
          refetch={refetch}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          selectedFaculty={selectedFaculty}
          isDeleteModalOpen={isDeleteModalOpen}
          closeDeleteModal={closeDeleteModal}
          refetch={refetch}
        />
      )}
    </>
  );
};

export default Faculty;
