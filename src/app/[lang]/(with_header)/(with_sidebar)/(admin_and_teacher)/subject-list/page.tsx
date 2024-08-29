'use client';
import { useCallback, useMemo, useState } from 'react';
import { Button, MenuItem, useDisclosure } from '@chakra-ui/react';
import { LanguageTypeEnum } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { v4 as uuidv4 } from 'uuid';
import { SubjectService } from '@/api/services/subject.service';
import ActionButtons from '@/components/molecules/ActionButtons';
import SearchTable from '@/components/organisms/SearchTable';
import useDebounce from '@/hooks/useDebounce';
import { Locale } from '@/i18n';
import { ITEMS_PER_PAGE } from '@/utils/constants/common';
import { ROUTE_SUBJECTS } from '@/utils/constants/routes';
import { languagePathHelper } from '@/utils/helpers/language';
import { QUERY_KEY } from '@/utils/helpers/queryClient';
import { Maybe } from '@/utils/models/common';
import { SubjectModel } from '@/utils/models/subject';

const DeleteModal = dynamic(() => import('./_components/modals/DeleteModal'));
const CreateEditModal = dynamic(() => import('./_components/modals/CreateEditModal'));

const Subject = ({ params }: { params: { lang: Locale } }) => {
  const session = useSession();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);
  const [selectedSubject, setSelectedSubject] = useState<Maybe<SubjectModel>>(null);
  const t = useTranslations();

  const {
    isOpen: isCreateEditModalOpen,
    onOpen: openCreateEditModal,
    onClose: closeCreateEditModal,
  } = useDisclosure({
    onClose() {
      setSelectedSubject(null);
    },
  });

  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal,
  } = useDisclosure({
    onClose() {
      setSelectedSubject(null);
    },
  });

  const { data, isLoading, isPlaceholderData, refetch } = useQuery({
    queryKey: QUERY_KEY.allSubjects(debouncedSearch, page),
    queryFn: () =>
      SubjectService.subjectList({
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

  const columnHelper = createColumnHelper<SubjectModel>();
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
    columnHelper.accessor('course.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('course'),
    }),
    columnHelper.accessor('description', {
      id: uuidv4(),
      cell: ({ row }) => (
        <Button
          as={Link}
          href={`${languagePathHelper(params.lang || 'en', ROUTE_SUBJECTS)}/${row.original.id}?language=${LanguageTypeEnum.EN}`}
          variant="link">
          {t('createTestQuestions')}
        </Button>
      ),
      header: t('createTestQuestions'),
    }),
    columnHelper.accessor('id', {
      id: uuidv4(),
      cell: ({ row }) => (
        <ActionButtons>
          <MenuItem
            color="green"
            onClick={() => {
              setSelectedSubject(row.original);
              openCreateEditModal();
            }}>
            {t('edit')}
          </MenuItem>
          <MenuItem
            color="red"
            onClick={() => {
              setSelectedSubject(row.original);
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
      <SearchTable
        title="subjectList"
        isLoading={isLoading}
        data={data?.subjects || []}
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
        {...(session?.data?.user?.role === 'ADMIN' ? { addNew: addNewFacultyHandler } : {})}
      />

      {isCreateEditModalOpen && (
        <CreateEditModal
          isCreateEditModalOpen={isCreateEditModalOpen}
          closeCreateEditModal={closeCreateEditModal}
          refetch={refetch}
          selectedSubject={selectedSubject}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          closeDeleteModal={closeDeleteModal}
          refetch={refetch}
          isDeleteModalOpen={isDeleteModalOpen}
          selectedSubject={selectedSubject}
        />
      )}
    </>
  );
};

export default Subject;
