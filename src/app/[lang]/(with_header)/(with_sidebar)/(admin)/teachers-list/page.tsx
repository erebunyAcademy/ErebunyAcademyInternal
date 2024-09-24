'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { Box, Button, MenuItem, useDisclosure } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { v4 as uuidv4 } from 'uuid';
import { TeacherService } from '@/api/services/teacher.service';
import { UserService } from '@/api/services/user.service';
import ActionButtons from '@/components/molecules/ActionButtons';
import SearchTable from '@/components/organisms/SearchTable';
import useDebounce from '@/hooks/useDebounce';
import { Locale } from '@/i18n';
import { ITEMS_PER_PAGE } from '@/utils/constants/common';
import { languagePathHelper } from '@/utils/helpers/language';
import { QUERY_KEY } from '@/utils/helpers/queryClient';
import { Maybe } from '@/utils/models/common';
import { TeacherModelSingle } from '@/utils/models/teachers';
import RejectMessageModal from './_components/modals/RejectMessageModal';

export default function Users({ params }: { params: { lang: Locale } }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);
  const [selectedTeacher, setSelectedTeacher] = useState<Maybe<TeacherModelSingle>>(null);
  const t = useTranslations();

  const { data, isLoading, isPlaceholderData, refetch } = useQuery({
    queryKey: QUERY_KEY.allTeachers(debouncedSearch, page),
    queryFn: () =>
      TeacherService.list({
        offset: page === 1 ? 0 : (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        search: debouncedSearch,
      }),
    initialData: {
      count: 0,
      users: [],
    },
  });
  const { mutate: confirmUserById } = useMutation({
    mutationFn: UserService.confirmUserVerificationById,
    onSuccess() {
      setSelectedTeacher(null);
      refetch();
    },
  });

  const {
    isOpen: isRejectTeacherModalOpen,
    onOpen: openTeacherRejectModal,
    onClose: closeTeacherRejectModal,
  } = useDisclosure();

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

  const columnHelper = createColumnHelper<TeacherModelSingle>();

  const columns = [
    columnHelper.accessor('id', {
      id: uuidv4(),
      cell: ({ row }) => (
        <Box display={row.original.isAdminVerified ? 'none' : 'block'}>
          <ActionButtons>
            <>
              <MenuItem
                color="green"
                disabled={row.original.isAdminVerified}
                onClick={() => {
                  confirmUserById(row.original.id);
                }}>
                {t('confirm')}
              </MenuItem>
              <MenuItem
                color="red"
                onClick={() => {
                  openTeacherRejectModal();
                  setSelectedTeacher(row.original);
                }}>
                {t('reject')}
              </MenuItem>
            </>
          </ActionButtons>
        </Box>
      ),
      header: t('actions'),
    }),
    columnHelper.accessor('id', {
      id: uuidv4(),
      cell: info => {
        const teacherId = info.row.original.id;
        return (
          <Button
            as={Link}
            href={`${languagePathHelper(params.lang, `/teachers-list/${teacherId}`)}`}
            variant="link">
            {t('seeSchedules')}
          </Button>
        );
      },
      header: t('schedules'),
    }),
    columnHelper.accessor('firstName', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('firstName'),
    }),
    columnHelper.accessor('lastName', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('lastName'),
    }),
    columnHelper.accessor('email', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('email'),
    }),
    columnHelper.accessor('teacher.profession', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('profession'),
    }),
    columnHelper.accessor('teacher.workPlace', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('workPlace'),
    }),
    columnHelper.accessor('createdAt', {
      id: uuidv4(),
      cell: info => dayjs(info.getValue()).format('DD-MM-YYYY'),
      header: t('createdAt'),
    }),
  ];

  return (
    <>
      <SearchTable
        title="teachersList"
        isLoading={isLoading}
        data={data.users}
        count={data.count}
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
        rowCondition="isAdminVerified"
      />

      {isRejectTeacherModalOpen && (
        <RejectMessageModal
          closeTeacherRejectModal={closeTeacherRejectModal}
          isRejectTeacherModalOpen={isRejectTeacherModalOpen}
          selectedTeacher={selectedTeacher}
          refetch={refetch}
        />
      )}
    </>
  );
}
