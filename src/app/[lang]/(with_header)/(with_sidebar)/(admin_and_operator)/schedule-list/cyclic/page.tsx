'use client';
import React, { useCallback, useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { ScheduleTypeEnum } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { ScheduleService } from '@/api/services/schedule.service';
import { ExpandableTable } from '@/components/organisms/GroupedDropdownTable';
import useDebounce from '@/hooks/useDebounce';
import { Locale } from '@/i18n';
import { ITEMS_PER_PAGE } from '@/utils/constants/common';
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
    queryKey: [
      debouncedSearch,
      page,
      sorting.length ? { id: sorting[0].id, desc: sorting[0].desc } : {},
    ],
    queryFn: () =>
      ScheduleService.list(
        ScheduleTypeEnum.CYCLIC,
        {
          offset: page === 1 ? 0 : (page - 1) * ITEMS_PER_PAGE,
          limit: ITEMS_PER_PAGE,
          search: debouncedSearch,
        },
        sorting,
      ),
    initialData: [],
  });

  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal,
  } = useDisclosure({
    onClose() {
      setSelectedSchedule(null);
    },
  });

  const {
    isOpen: isCreateEditModalOpen,
    onOpen: openCreateEditModal,
    onClose: closeCreateEditModal,
  } = useDisclosure({
    onClose() {
      setSelectedSchedule(null);
    },
  });

  const {
    isOpen: isCreateEditThematicPlanModalIsOpen,
    onOpen: openAddEditThematicPlanModal,
    onClose: closeCreateEditThematicPlanModal,
  } = useDisclosure({
    onClose() {
      setSelectedSchedule(null);
    },
  });

  const { mutate: deleteScheduleMutation } = useMutation({
    mutationFn: ScheduleService.deleteScheduleById,
    onSuccess() {
      refetch();
      closeDeleteModal();
    },
  });

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
      id: 'courseGroup',
      cell: info => info.getValue(),
      header: t('courseGroup'),
    }),
    columnHelper.accessor('course.title', {
      id: 'course',
      cell: info => info.getValue(),
      header: t('course'),
    }),
    columnHelper.accessor('course.faculty.title', {
      id: 'faculty',
      cell: info => info.getValue(),
      header: t('faculty'),
    }),
    columnHelper.accessor('description', {
      cell: info => info.getValue(),
      header: t('description'),
    }),
  ];

  const subRowColumns = [
    columnHelper.accessor('schedules.startDayDate', {
      id: 'lecturer',
      cell: info => info.getValue(),
      header: t('lecturer'),
    }),
    columnHelper.accessor('schedules.endDayDate', {
      id: 'endDate',
      cell: info => info.getValue(),
      header: t('endDate'),
    }),
  ];

  return (
    <>
      <ExpandableTable
        parentColumns={columns as any}
        data={data as any}
        subRowColumns={subRowColumns as any}
        getSubRows={(row: any) => row.schedules}
      />

      {isCreateEditModalOpen && (
        <CreateEditModal
          refetch={refetch}
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
