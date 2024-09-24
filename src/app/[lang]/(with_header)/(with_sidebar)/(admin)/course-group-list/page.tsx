'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { Button, MenuItem, useDisclosure } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { v4 as uuidv4 } from 'uuid';
import { CourseGroupService } from '@/api/services/course-group.service';
import ActionButtons from '@/components/molecules/ActionButtons';
import SearchTable from '@/components/organisms/SearchTable';
import useDebounce from '@/hooks/useDebounce';
import { Locale } from '@/i18n';
import { ITEMS_PER_PAGE } from '@/utils/constants/common';
import { ROUTE_COURSE_GROUP } from '@/utils/constants/routes';
import { languagePathHelper } from '@/utils/helpers/language';
import { QUERY_KEY } from '@/utils/helpers/queryClient';
import { Maybe } from '@/utils/models/common';
import { CourseGroupSingleModel } from '@/utils/models/courseGroup';

const DeleteModal = dynamic(() => import('./_components/modals/DeleteModal'));
const CreateEditModal = dynamic(() => import('./_components/modals/CreateEditModal'));

const CourseGroup = ({ params }: { params: { lang: Locale } }) => {
  const t = useTranslations();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);
  const [selectedCourseGroup, setSelectedCourseGroup] =
    useState<Maybe<CourseGroupSingleModel>>(null);

  const {
    isOpen: isCreateEditModalOpen,
    onOpen: openCreateEditModal,
    onClose: closeCreateEditModal,
  } = useDisclosure({
    onClose() {
      setSelectedCourseGroup(null);
    },
  });

  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal,
  } = useDisclosure({
    onClose() {
      setSelectedCourseGroup(null);
    },
  });

  const { data, isLoading, isPlaceholderData, refetch } = useQuery({
    queryKey: QUERY_KEY.allCourseGroups(debouncedSearch, page),
    queryFn: () =>
      CourseGroupService.courseGroupList({
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

  const columnHelper = createColumnHelper<CourseGroupSingleModel>();

  const columns = [
    columnHelper.accessor('title', {
      id: uuidv4(),
      cell: info => {
        const courseGroupId = info.row.original.id;
        return (
          <Button
            as={Link}
            href={`${languagePathHelper(params.lang, `/students-list?courseGroupId=${courseGroupId}`)}`}
            variant="link">
            {info.getValue()}
          </Button>
        );
      },
      header: t('title'),
    }),
    columnHelper.accessor('description', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('description'),
    }),
    columnHelper.accessor('id', {
      id: uuidv4(),
      cell: info => (
        <Button
          as={Link}
          href={`${languagePathHelper(params.lang, `${ROUTE_COURSE_GROUP}/${info.getValue()}/register`)}`}
          variant="link">
          {t('openRegister')}
        </Button>
      ),
      header: t('academicRegister'),
    }),
    columnHelper.accessor('course.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('course'),
    }),
    columnHelper.accessor('course.faculty.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('faculty'),
    }),

    columnHelper.accessor('id', {
      id: uuidv4(),
      cell: ({ row }) => (
        <ActionButtons>
          <MenuItem
            color="green"
            onClick={() => {
              setSelectedCourseGroup(row.original);
              openCreateEditModal();
            }}>
            {t('edit')}
          </MenuItem>
          <MenuItem
            color="red"
            onClick={() => {
              setSelectedCourseGroup(row.original);
              openDeleteModal();
            }}>
            {t('delete')}
          </MenuItem>
        </ActionButtons>
      ),
      header: t('actions'),
    }),
  ];

  const addNewStudentGradeGroupHandler = useCallback(() => {
    openCreateEditModal();
  }, [openCreateEditModal]);

  return (
    <>
      <SearchTable
        title="courseGroupList"
        isLoading={isLoading}
        data={data?.courseGroups || []}
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
        addNew={addNewStudentGradeGroupHandler}
      />
      {isCreateEditModalOpen && (
        <CreateEditModal
          isCreateEditModalOpen={isCreateEditModalOpen}
          closeCreateEditModal={closeCreateEditModal}
          selectedCourseGroup={selectedCourseGroup}
          refetch={refetch}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          selectedCourseGroup={selectedCourseGroup}
          isDeleteModalOpen={isDeleteModalOpen}
          closeDeleteModal={closeDeleteModal}
          refetch={refetch}
        />
      )}
    </>
  );
};

export default CourseGroup;
