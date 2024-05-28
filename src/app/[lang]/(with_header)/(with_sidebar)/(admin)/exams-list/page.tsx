'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { Button, useDisclosure } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { v4 as uuidv4 } from 'uuid';
import { ExamService } from '@/api/services/exam.service';
import { SubjectService } from '@/api/services/subject.service';
import { SelectLabel } from '@/components/atoms';
import Modal from '@/components/molecules/Modal';
import SearchTable from '@/components/organisms/SearchTable';
import useDebounce from '@/hooks/useDebounce';
import { ITEMS_PER_PAGE } from '@/utils/constants/common';
import { ROUTE_EXAMS } from '@/utils/constants/routes';
import { QUERY_KEY } from '@/utils/helpers/queryClient';
import { FacultyModel } from '@/utils/models/faculty';

export default function Users() {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);
  const [subject, setSubject] = useState('');
  const t = useTranslations();

  const {
    isOpen: isCreateExamModalIsOpen,
    onOpen: openCreateExamModal,
    onClose: closeCreateExamModal,
  } = useDisclosure();

  const { data, isLoading, isPlaceholderData } = useQuery({
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
    columnHelper.accessor('createdAt', {
      id: uuidv4(),
      cell: info => {
        const currentDate = dayjs(info.getValue());
        return currentDate.format('YYYY-MM-DD');
      },
      header: t('createdAt'),
    }),
  ];

  const { mutate: createExamMutation, isPending } = useMutation({
    mutationFn: ExamService.createExamBySubjectId,
    onSuccess(res) {
      router.push(`${ROUTE_EXAMS}/create-edit/${res.id}`);
    },
  });

  const { data: subjectList } = useQuery({
    queryKey: ['subject-list'],
    queryFn: SubjectService.list,
  });

  console.log({});

  return (
    <>
      <SearchTable
        title={t('examList')}
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
      <Modal isOpen={isCreateExamModalIsOpen} onClose={closeCreateExamModal} title={'createExam'}>
        <SelectLabel
          name="create-exam-modal"
          isRequired
          options={subjectList || []}
          labelName={'subject'}
          valueLabel="id"
          nameLabel="title"
          onChange={e => setSubject(e.target.value)}
          value={subject}
        />
        <Button
          isLoading={isPending}
          onClick={() => {
            createExamMutation(subject);
          }}>
          Send
        </Button>
      </Modal>
    </>
  );
}
