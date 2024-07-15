'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { MenuItem, useDisclosure } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { CourseService } from '@/api/services/courses.service';
import ActionButtons from '@/components/molecules/ActionButtons';
import SearchTable from '@/components/organisms/SearchTable';
import useDebounce from '@/hooks/useDebounce';
import { ITEMS_PER_PAGE } from '@/utils/constants/common';
import { QUERY_KEY } from '@/utils/helpers/queryClient';
import { Maybe } from '@/utils/models/common';
import { CourseModel } from '@/utils/models/course';
import { CreateEditCourseValidation } from '@/utils/validation/courses';
import CreateEditModal from './_components/modals/create-edit-modal';
import DeleteModal from './_components/modals/delete-modal';

const resolver = classValidatorResolver(CreateEditCourseValidation);

const Courses = () => {
  const t = useTranslations();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);
  const [selectedCourse, setSelectedCourse] = useState<Maybe<CourseModel>>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateEditCourseValidation>({
    resolver,
    defaultValues: {
      title: '',
      description: '',
      facultyId: '',
    },
  });

  const {
    isOpen: isCreateEditModalOpen,
    onOpen: openCreateEditModal,
    onClose: closeCreateEditModal,
  } = useDisclosure({
    onClose() {
      reset();
      setSelectedCourse(null);
    },
  });

  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal,
  } = useDisclosure({
    onClose() {
      setSelectedCourse(null);
    },
  });

  const { data, isLoading, isPlaceholderData, refetch } = useQuery({
    queryKey: QUERY_KEY.allCourses(debouncedSearch, page),
    queryFn: () =>
      CourseService.courseList({
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

  const columnHelper = createColumnHelper<CourseModel>();

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
    columnHelper.accessor('faculty.title', {
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
              setSelectedCourse(row.original);
              reset({
                title: row.original.title,
                description: row.original.description || '',
                facultyId: row.original.faculty?.id,
              });
              openCreateEditModal();
            }}>
            {t('edit')}
          </MenuItem>
          <MenuItem
            color="red"
            onClick={() => {
              setSelectedCourse(row.original);
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
        title="courseList"
        isLoading={isLoading}
        data={data?.courses || []}
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

      <CreateEditModal
        isCreateEditModalOpen={isCreateEditModalOpen}
        closeCreateEditModal={closeCreateEditModal}
        selectedCourse={selectedCourse}
        refetch={refetch}
        reset={reset}
        isValid={isValid}
        handleSubmit={handleSubmit}
        errors={errors}
        control={control}
      />
      <DeleteModal
        closeDeleteModal={closeDeleteModal}
        refetch={refetch}
        isDeleteModalOpen={isDeleteModalOpen}
        selectedCourse={selectedCourse}
      />
    </>
  );
};

export default Courses;
