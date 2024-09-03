'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { Button, MenuItem, useDisclosure } from '@chakra-ui/react';
import { ScheduleTypeEnum } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ScheduleService } from '@/api/services/schedule.service';
import ActionButtons from '@/components/molecules/ActionButtons';
import SearchTable from '@/components/organisms/SearchTable';
import useDebounce from '@/hooks/useDebounce';
import { Locale } from '@/i18n';
import { academicYearListData, ITEMS_PER_PAGE } from '@/utils/constants/common';
import { languagePathHelper } from '@/utils/helpers/language';
import { QUERY_KEY } from '@/utils/helpers/queryClient';
import { Maybe } from '@/utils/models/common';
import { ScheduleSingleModel } from '@/utils/models/schedule';
import AddEditThematicPlan from './_components/modals/AddEditThematicPlan';

const DeleteModal = dynamic(() => import('./_components/modals/DeleteModal'));
const CreateEditModal = dynamic(() => import('./_components/modals/CreateEditModal'));

export default function Schedule({ params }: { params: { lang: Locale } }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedSchedule, setSelectedSchedule] = useState<Maybe<ScheduleSingleModel>>(null);
  const debouncedSearch = useDebounce(search);
  const t = useTranslations();

  const { data, isLoading, isPlaceholderData, refetch } = useQuery({
    queryKey: QUERY_KEY.allTeachers(debouncedSearch, page),
    queryFn: () =>
      ScheduleService.list(
        ScheduleTypeEnum.NON_CYCLIC,
        {
          offset: page === 1 ? 0 : (page - 1) * ITEMS_PER_PAGE,
          limit: ITEMS_PER_PAGE,
          search: debouncedSearch,
        },
        sorting,
      ),
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

  const {
    isOpen: isCreateEditThematicPlanModalIsOpen,
    onOpen: openAddEditThematicPlanModal,
    onClose: closeCreateEditThematicPlanModal,
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
    columnHelper.accessor('id', {
      cell: ({ row }) => (
        <ActionButtons>
          <MenuItem
            color="green"
            onClick={() => {
              setSelectedSchedule(row.original);
              openAddEditThematicPlanModal();
            }}>
            {t('addThematicPlan')}
          </MenuItem>
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
    columnHelper.accessor('id', {
      header: t('seeDetails'),
      cell: info => (
        <Button
          as={Link}
          href={`${languagePathHelper(params.lang, `/schedules/${info.getValue()}`)}`}
          variant="link">
          {t('seeDetails')}
        </Button>
      ),
    }),
    columnHelper.accessor('courseGroup.title', {
      id: 'courseGroup',
      cell: info => info.getValue(),
      header: t('courseGroup'),
    }),
    columnHelper.accessor('subject.title', {
      id: 'subject',
      cell: info => info.getValue(),
      header: t('subject'),
    }),
    columnHelper.accessor('title', {
      cell: info => info.getValue(),
      header: t('title'),
    }),
    columnHelper.accessor('description', {
      cell: info => info.getValue(),
      header: t('description'),
    }),
    columnHelper.accessor('totalHours', {
      cell: info => info.getValue(),
      header: t('totalHours'),
    }),
    columnHelper.accessor('examType', {
      cell: info => info.getValue(),
      header: t('examType'),
    }),
    columnHelper.accessor('scheduleTeachers', {
      cell: info =>
        `${info.getValue()[0].teacher?.user.firstName} ${info.getValue()[0].teacher?.user.lastName}`,
      header: t('lecturer'),
    }),

    columnHelper.accessor('academicYear', {
      cell: info => {
        const academicYear = academicYearListData.find(year => year.id === info.getValue());
        return academicYear?.title;
      },
      header: t('academicYear'),
    }),
    columnHelper.accessor('createdAt', {
      cell: info => dayjs(info.getValue()).format('YYYY-MM-DD'),
      header: t('createdAt'),
    }),
  ];

  return (
    <>
      <SearchTable
        title="notCyclicScheduleList"
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

      {isCreateEditThematicPlanModalIsOpen && selectedSchedule && (
        <AddEditThematicPlan
          isModalOpen={isCreateEditThematicPlanModalIsOpen}
          closeModal={closeCreateEditThematicPlanModal}
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
