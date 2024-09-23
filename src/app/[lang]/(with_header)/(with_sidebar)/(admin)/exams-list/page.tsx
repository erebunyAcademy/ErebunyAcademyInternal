'use client';
import React, { Fragment, useCallback, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  ListItem,
  MenuItem,
  Text,
  UnorderedList,
  useDisclosure,
} from '@chakra-ui/react';
import { LanguageTypeEnum } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { v4 as uuidv4 } from 'uuid';
import { ExamService } from '@/api/services/exam.service';
import { StudentService } from '@/api/services/student.service';
import ActionButtons from '@/components/molecules/ActionButtons';
import Modal from '@/components/molecules/Modal';
import NoDataFound from '@/components/molecules/NoDataFound';
import SearchTable from '@/components/organisms/SearchTable';
import SimpleTable from '@/components/organisms/SimpleTable';
import useDebounce from '@/hooks/useDebounce';
import { Locale } from '@/i18n';
import { ITEMS_PER_PAGE } from '@/utils/constants/common';
import { ROUTE_EXAMS } from '@/utils/constants/routes';
import { languagePathHelper } from '@/utils/helpers/language';
import { QUERY_KEY } from '@/utils/helpers/queryClient';
import { Maybe } from '@/utils/models/common';
import { ExamModel } from '@/utils/models/exam';
import { ExamParticipantsListModel } from '@/utils/models/student';
import { UpdateExamStatusValidation } from '@/utils/validation/exam';

const CreateExamModal = dynamic(() => import('@/components/molecules/CreateExamModal'));

export default function ExamsList({
  params,
  searchParams,
}: {
  params: { lang: Locale };
  searchParams: { orderBy: string; sortBy: string };
}) {
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
  } = useDisclosure();
  const {
    isOpen: isStudentsModalOpen,
    onOpen: openStudentsModal,
    onClose: closeStudentsModal,
  } = useDisclosure();

  const {
    isOpen: testQuestionModalIsOpen,
    onOpen: openTestQuestionModal,
    onClose: closeTestQuestionModal,
  } = useDisclosure();

  const {
    isOpen: isCreateEditExamModalIsOpen,
    onOpen: openCreateEditModal,
    onClose: closeCreateEditExamModal,
  } = useDisclosure({
    onClose() {
      setSelectedExam(null);
      refetch();
    },
  });

  const { data, isLoading, isPlaceholderData, refetch } = useQuery({
    queryKey: QUERY_KEY.allExams(debouncedSearch, page, searchParams.orderBy, searchParams.sortBy),
    queryFn: () =>
      ExamService.list({
        offset: page === 1 ? 0 : (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        orderBy: searchParams.orderBy,
        sortBy: searchParams.sortBy,
        search: debouncedSearch,
      }),
  });

  const { data: studentsData } = useQuery({
    queryKey: ['exam-students-list', selectedExam?.id],
    queryFn: () => StudentService.getStudentsByExamId(selectedExam?.id!),
    enabled: isStudentsModalOpen && !!selectedExam,
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
  const columnHelperStudents = createColumnHelper<ExamParticipantsListModel>();

  const studentsColumns = [
    columnHelperStudents.accessor('student.user.firstName', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('firstName'),
    }),
    columnHelperStudents.accessor('student.user.lastName', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('lastName'),
    }),
    columnHelperStudents.accessor('student.user.email', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('email'),
    }),
  ];

  const columnHelper = createColumnHelper<ExamModel>();

  const columns = [
    columnHelper.accessor('course.faculty.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('faculty'),
    }),
    columnHelper.accessor('course.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('course'),
    }),
    columnHelper.accessor('courseGroup.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('courseGroup'),
    }),
    columnHelper.accessor('status', {
      id: uuidv4(),
      cell: info => info.getValue().split('_').join(' '),
      header: t('status'),
    }),
    columnHelper.accessor('examLanguages', {
      id: uuidv4(),
      cell: info => (
        <UnorderedList>
          {info.getValue().map((examLanguage, index) => (
            <Fragment key={index}>
              <ListItem key={index}>{examLanguage.title}</ListItem>
              <Divider />
            </Fragment>
          ))}
        </UnorderedList>
      ),
      header: t('title'),
    }),
    columnHelper.accessor('id', {
      id: uuidv4(),
      cell: info => {
        const status = info.row.original.status;
        return (
          <Button
            {...(!(status === 'NOT_STARTED')
              ? { isDisabled: true }
              : {
                  as: Link,
                  href: languagePathHelper(
                    params.lang,
                    `${ROUTE_EXAMS}/create-edit/${info.getValue()}/${info.row.original.subject?.id}?language=${LanguageTypeEnum.EN}`,
                  ),
                })}
            variant="link">
            {t('editExam')}
          </Button>
        );
      },
      header: t('edit'),
    }),

    columnHelper.accessor('id', {
      id: uuidv4(),
      cell: info => (
        <Button
          variant="link"
          onClick={() => {
            router.push(
              languagePathHelper(params.lang, `${ROUTE_EXAMS}/result/${info.getValue()}`),
            );
          }}>
          {t('seeExamResults')}
        </Button>
      ),
      header: t('examResults'),
    }),
    columnHelper.accessor('subject.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('subject'),
    }),
    columnHelper.accessor('duration', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('duration'),
    }),
    columnHelper.accessor('studentExams', {
      id: uuidv4(),
      cell: info => (
        <Button
          variant="link"
          onClick={() => {
            openStudentsModal();
            setSelectedExam(info.row.original);
          }}>
          {t('seeStudents')}
        </Button>
      ),
      header: t('students'),
    }),
    columnHelper.accessor('id', {
      id: uuidv4(),
      cell: info => (
        <Button
          variant="link"
          onClick={() => {
            openTestQuestionModal();
            setSelectedExam(info.row.original);
          }}>
          {t('seeQuestions')}
        </Button>
      ),
      header: t('questions'),
    }),
    columnHelper.accessor('createdAt', {
      id: uuidv4(),
      cell: info => {
        const currentDate = dayjs(info.getValue());
        return currentDate.format('DD-MM-YYYY HH:mm');
      },
      header: t('createdAt'),
    }),
    columnHelper.accessor('id', {
      id: uuidv4(),
      cell: ({ row }) => (
        <ActionButtons>
          {row.original.status === 'NOT_STARTED' && (
            <MenuItem
              color="green"
              onClick={() => {
                setSelectedExam(row.original);
                openCreateEditModal();
              }}>
              {t('editExam')}
            </MenuItem>
          )}
          {row.original.status === 'NOT_STARTED' && (
            <MenuItem
              color="green"
              onClick={() => {
                updateExamStatus({ data: { status: 'IN_PROGRESS' }, examId: row.original.id });
              }}>
              {t('startExam')}
            </MenuItem>
          )}
          {row.original.status === 'IN_PROGRESS' && (
            <MenuItem
              color="red"
              onClick={() => {
                updateExamStatus({ data: { status: 'COMPLETED' }, examId: row.original.id });
              }}>
              {t('finishExam')}
            </MenuItem>
          )}
          {row.original.status !== 'IN_PROGRESS' && (
            <MenuItem
              color="red"
              onClick={() => {
                setSelectedExam(row.original);
                openDeleteModal();
              }}>
              {t('deleteExam')}
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
        search={search}
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

      <CreateExamModal
        isOpen={isCreateEditExamModalIsOpen}
        onClose={closeCreateEditExamModal}
        exam={selectedExam}
        params={params}
      />

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

      <Modal isOpen={isStudentsModalOpen} onClose={closeStudentsModal} isDeleteVariant>
        <SimpleTable columns={studentsColumns as any} title="students" data={studentsData || []} />
      </Modal>

      {selectedExam && (
        <Modal isOpen={testQuestionModalIsOpen} onClose={closeTestQuestionModal}>
          {selectedExam.examLanguages.length > 0 ? (
            selectedExam.examLanguages.map(examLanguage => (
              <Box key={examLanguage.id} p={4}>
                <Text fontWeight="bold" mb={2}>
                  Language: {examLanguage.language}
                </Text>
                {examLanguage.examTranslationTests.length > 0 ? (
                  <UnorderedList spacing={4}>
                    {examLanguage.examTranslationTests.map(tr => (
                      <Box key={tr.id} mb={6}>
                        <Text fontWeight="semibold" mb={1}>
                          Question: {tr.testQuestion.title}
                        </Text>
                        <UnorderedList styleType="circle" spacing={2}>
                          {tr.testQuestion.options.map(option => (
                            <ListItem key={option.id}>{option.title}</ListItem>
                          ))}
                        </UnorderedList>
                      </Box>
                    ))}
                  </UnorderedList>
                ) : (
                  <NoDataFound />
                )}
              </Box>
            ))
          ) : (
            <NoDataFound />
          )}
        </Modal>
      )}
    </>
  );
}
