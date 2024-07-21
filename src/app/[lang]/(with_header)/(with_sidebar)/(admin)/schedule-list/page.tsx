'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { MenuItem, useDisclosure } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { v4 as uuidv4 } from 'uuid';
import { ScheduleService } from '@/api/services/schedule.service';
import ActionButtons from '@/components/molecules/ActionButtons';
import SearchTable from '@/components/organisms/SearchTable';
import useDebounce from '@/hooks/useDebounce';
import { ITEMS_PER_PAGE } from '@/utils/constants/common';
import { QUERY_KEY } from '@/utils/helpers/queryClient';
import { Maybe } from '@/utils/models/common';
import { ScheduleSingleModel } from '@/utils/models/schedule';

const DeleteModal = dynamic(() => import('./_components/modals/DeleteModal'));
const CreateEditModal = dynamic(() => import('./_components/modals/CreateEditModal'));

export default function Schedule() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedSchedule, setSelectedSchedule] = useState<Maybe<ScheduleSingleModel>>(null);
  const debouncedSearch = useDebounce(search);
  const t = useTranslations();

  const { data, isLoading, isPlaceholderData, refetch } = useQuery({
    queryKey: QUERY_KEY.allTeachers(debouncedSearch, page),
    queryFn: () =>
      ScheduleService.list({
        offset: page === 1 ? 0 : (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        search: debouncedSearch,
      }),
  });

  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal,
  } = useDisclosure({
    onClose() {
      refetch();
      setSelectedSchedule(null);
    },
  });

  const {
    isOpen: isCreateEditModalOpen,
    onOpen: openCreateEditModal,
    onClose: closeCreateEditModal,
  } = useDisclosure({
    onClose() {
      refetch();
      setSelectedSchedule(null);
    },
  });

  const { mutate: deleteScheduleMutation } = useMutation({
    mutationFn: ScheduleService.deleteScheduleById,
    onSuccess() {
      closeDeleteModal();
    },
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

  const columnHelper = createColumnHelper<ScheduleSingleModel>();

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
    columnHelper.accessor('totalHours', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('totalHours'),
    }),
    columnHelper.accessor('isAssessment', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('isAssessment'),
    }),
    columnHelper.accessor('id', {
      id: uuidv4(),
      cell: ({ row }) => (
        <ActionButtons>
          <MenuItem
            color="green"
            onClick={() => {
              setSelectedSchedule(row.original);
              openCreateEditModal();
            }}>
            {t('edit')}
          </MenuItem>
          <MenuItem
            color="red"
            onClick={() => {
              setSelectedSchedule(row.original);
              openDeleteModal();
            }}>
            {t('delete')}
          </MenuItem>
        </ActionButtons>
      ),
      header: t('actions'),
    }),
  ];

  return (
    <>
      <SearchTable
        title="scheduleList"
        isLoading={isLoading}
        data={data?.schedules || []}
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
        addNew={openCreateEditModal}
      />

      {isCreateEditModalOpen && (
        <CreateEditModal
          isModalOpen={isCreateEditModalOpen}
          closeModal={closeCreateEditModal}
          selectedSchedule={selectedSchedule}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          selectedSchedule={selectedSchedule}
          isDeleteModalOpen={isDeleteModalOpen}
          closeDeleteModal={closeDeleteModal}
          actionHandler={deleteScheduleMutation}
        />
      )}
    </>
  );
}
