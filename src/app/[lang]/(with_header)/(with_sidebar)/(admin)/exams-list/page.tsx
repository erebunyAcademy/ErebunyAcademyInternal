'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { Button, MenuItem, useDisclosure } from '@chakra-ui/react';
import { LanguageTypeEnum } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { v4 as uuidv4 } from 'uuid';
import { ExamService } from '@/api/services/exam.service';
import ActionButtons from '@/components/molecules/ActionButtons';
import CreateExamModal from '@/components/molecules/CreateExamModal';
import Modal from '@/components/molecules/Modal';
import SearchTable from '@/components/organisms/SearchTable';
import useDebounce from '@/hooks/useDebounce';
import { Locale } from '@/i18n';
import { ITEMS_PER_PAGE } from '@/utils/constants/common';
import { ROUTE_EXAMS } from '@/utils/constants/routes';
import { languagePathHelper } from '@/utils/helpers/language';
import { QUERY_KEY } from '@/utils/helpers/queryClient';
import { Maybe } from '@/utils/models/common';
import { ExamModel } from '@/utils/models/exam';
import { UpdateExamStatusValidation } from '@/utils/validation/exam';

export default function ExamsList({ params }: { params: { lang: Locale } }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState('');
  const router = useRouter();
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);
  const [selectedExam, setSelectedExam] = useState<Maybe<ExamModel>>(null);
  const t = useTranslations();

  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal,
  } = useDisclosure({
    onClose() {},
  });

  const {
    isOpen: isCreateExamModalIsOpen,
    onOpen: openCreateExamModal,
    onClose: closeCreateExamModal,
  } = useDisclosure();

  const { data, isLoading, isPlaceholderData, refetch } = useQuery({
    queryKey: QUERY_KEY.allExams(debouncedSearch, page),
    queryFn: () =>
      ExamService.list({
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

  const { mutate } = useMutation({
    mutationFn: ExamService.deleteExamById,
    onSuccess() {
      closeDeleteModal();
      refetch();
    },
  });

  const { mutate: updateExamStatus } = useMutation({
    mutationFn: ({ data, examId }: { data: UpdateExamStatusValidation; examId: string }) =>
      ExamService.updateExamStatus(examId, data),
    onSuccess() {
      refetch();
    },
  });

  const columnHelper = createColumnHelper<ExamModel>();
  const columns = [
    columnHelper.accessor('course.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('course'),
    }),
    columnHelper.accessor('status', {
      id: uuidv4(),
      cell: info => info.getValue().split('_').join(' '),
      header: t('status'),
    }),
    columnHelper.accessor('id', {
      id: uuidv4(),
      cell: info => (
        <Button
          as={Link}
          variant="link"
          href={languagePathHelper(
            params.lang,
            `${ROUTE_EXAMS}/create-edit/${info.getValue()}/${info.row.original.subject?.id}?language=${LanguageTypeEnum.EN}`,
          )}>
          {t('editExam')}
        </Button>
      ),
      header: t('edit'),
    }),
    columnHelper.accessor('courseGroup.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('courseGroup'),
    }),
    columnHelper.accessor('id', {
      id: uuidv4(),
      cell: info => (
        <Button
          variant="link"
          onClick={() => {
            router.push(`${ROUTE_EXAMS}/result/${info.getValue()}`);
          }}>
          See exam results
        </Button>
      ),
      header: 'Exam results',
    }),
    columnHelper.accessor('subject.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('subject'),
    }),
    columnHelper.accessor('createdAt', {
      id: uuidv4(),
      cell: info => {
        const currentDate = dayjs(info.getValue());
        return currentDate.format('YYYY-MM-DD');
      },
      header: t('createdAt'),
    }),
    columnHelper.accessor('id', {
      id: uuidv4(),
      cell: ({ row }) => (
        <ActionButtons>
          {row.original.status !== 'IN_PROGRESS' && (
            <MenuItem
              color="green"
              onClick={() => {
                updateExamStatus({ data: { status: 'IN_PROGRESS' }, examId: row.original.id });
              }}>
              Start exam
            </MenuItem>
          )}

          <MenuItem
            color="red"
            onClick={() => {
              updateExamStatus({ data: { status: 'COMPLETED' }, examId: row.original.id });
            }}>
            Finish exam
          </MenuItem>

          {row.original.status !== 'IN_PROGRESS' && (
            <MenuItem
              color="red"
              onClick={() => {
                setSelectedExam(row.original);
                openDeleteModal();
              }}>
              Delete exam
            </MenuItem>
          )}
        </ActionButtons>
      ),
      header: t('actions'),
    }),
  ];

  return (
    <>
      <SearchTable
        title="examList"
        isLoading={isLoading}
        data={data?.exams || []}
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
        addNew={openCreateExamModal}
      />
      <CreateExamModal isOpen={isCreateExamModalIsOpen} onClose={closeCreateExamModal} />
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        isDeleteVariant
        title="exam"
        primaryAction={() => {
          if (selectedExam) {
            mutate(selectedExam.id);
          }
        }}
        actionText="delete">
        {t('deleteExamQuestion')}
      </Modal>
    </>
  );
}
