'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { MenuItem, useDisclosure } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { CourseService } from '@/api/services/courses.service';
import { FacultyService } from '@/api/services/faculty.service';
import { FormInput, SelectLabel } from '@/components/atoms';
import ActionButtons from '@/components/molecules/ActionButtons';
import Modal from '@/components/molecules/Modal';
import SearchTable from '@/components/organisms/SearchTable';
import useDebounce from '@/hooks/useDebounce';
import { ITEMS_PER_PAGE } from '@/utils/constants/common';
import { QUERY_KEY } from '@/utils/helpers/queryClient';
import { Maybe } from '@/utils/models/common';
import { CourseModel } from '@/utils/models/course';
import { FacultySignupListModel } from '@/utils/models/faculty';
import { CreateEditCourseValidation } from '@/utils/validation/courses';

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
    setValue,
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

  const { data: facultyQueryData } = useQuery<FacultySignupListModel>({
    queryKey: ['faculty'],
    queryFn: FacultyService.list,
    enabled: isCreateEditModalOpen,
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
        sorting: sorting,
        search: debouncedSearch,
      }),
  });

  const { mutate: createCourse } = useMutation({
    mutationFn: CourseService.createCourse,
    onSuccess() {
      refetch();
      reset();
      closeCreateEditModal();
    },
  });

  const { mutate: updateCourse } = useMutation({
    mutationFn: CourseService.updateCourse,
    onSuccess() {
      refetch();
      reset();
      closeCreateEditModal();
    },
  });
  const { mutate } = useMutation({
    mutationFn: CourseService.deleteCourse,
    onSuccess() {
      closeDeleteModal();
      refetch();
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
              setValue('title', row.original.title || '');
              setValue('description', row.original.description || '');
              setValue('facultyId', row.original.faculty?.id || '');
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

  const addNewCourseHandler = useCallback(() => {
    openCreateEditModal();
  }, [openCreateEditModal]);

  const onSubmitHandler = useCallback(
    (data: CreateEditCourseValidation) => {
      if (selectedCourse) {
        updateCourse({ data, id: selectedCourse.id });
      } else {
        createCourse(data);
      }
    },
    [createCourse, selectedCourse, updateCourse],
  );

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
        addNew={addNewCourseHandler}
      />

      <Modal
        isOpen={isCreateEditModalOpen}
        onClose={closeCreateEditModal}
        title="course"
        primaryAction={handleSubmit(onSubmitHandler)}
        isDisabled={!isValid}
        actionText={selectedCourse ? 'edit' : 'create'}>
        <Controller
          name="title"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <FormInput
              isRequired
              name={name}
              type="text"
              formLabelName={t('courseTitle')}
              value={value}
              placeholder="enterTitle"
              handleInputChange={onChange}
              isInvalid={!!errors.title?.message}
              formErrorMessage={errors.title?.message}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <FormInput
              name={name}
              type="text"
              formLabelName={t('courseDescription')}
              value={value}
              placeholder="enterDescription"
              handleInputChange={onChange}
              isInvalid={!!errors.description?.message}
              formErrorMessage={errors.description?.message}
            />
          )}
        />
        <Controller
          name="facultyId"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <SelectLabel
              name={name}
              isRequired
              options={facultyQueryData || []}
              labelName="faculty"
              valueLabel="id"
              nameLabel="title"
              onChange={onChange}
              value={value}
              isInvalid={!!errors.facultyId?.message}
              formErrorMessage={errors.facultyId?.message}
            />
          )}
        />
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        isDeleteVariant
        onClose={closeDeleteModal}
        title="course"
        primaryAction={() => {
          if (selectedCourse) {
            mutate(selectedCourse?.id);
          }
        }}
        actionText="delete">
        {t('deleteCourseQuestion')}
      </Modal>
    </>
  );
};

export default Courses;
