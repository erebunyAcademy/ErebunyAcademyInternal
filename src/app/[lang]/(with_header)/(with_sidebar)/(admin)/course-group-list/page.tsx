'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { MenuItem, useDisclosure } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { CourseGroupService } from '@/api/services/course-group.service';
import { CourseService } from '@/api/services/courses.service';
import { FormInput, SelectLabel } from '@/components/atoms';
import ActionButtons from '@/components/molecules/ActionButtons';
import Modal from '@/components/molecules/Modal';
import SearchTable from '@/components/organisms/SearchTable';
import useDebounce from '@/hooks/useDebounce';
import { CreateEditStudentGradeGroupValidation } from '@/studentGradeGroup';
import { ITEMS_PER_PAGE } from '@/utils/constants/common';
import { QUERY_KEY } from '@/utils/helpers/queryClient';
import { Maybe } from '@/utils/models/common';
import { GetCoursesListModel } from '@/utils/models/course';
import { CourseGroupSingleModel } from '@/utils/models/courseGroup';

const resolver = classValidatorResolver(CreateEditStudentGradeGroupValidation);

const StudentGradeGroup = () => {
  const t = useTranslations();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);
  const [selectedStudentGradeGroup, setSelectedStudentGradeGroup] =
    useState<Maybe<CourseGroupSingleModel>>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreateEditStudentGradeGroupValidation>({
    resolver,
    defaultValues: {
      title: '',
      description: '',
      courseId: '',
    },
  });

  const {
    isOpen: isCreateEditModalOpen,
    onOpen: openCreateEditModal,
    onClose: closeCreateEditModal,
  } = useDisclosure({
    onClose() {
      reset();
      setSelectedStudentGradeGroup(null);
    },
  });

  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal,
  } = useDisclosure({
    onClose() {
      setSelectedStudentGradeGroup(null);
    },
  });

  const { data, isLoading, isPlaceholderData, refetch } = useQuery({
    queryKey: QUERY_KEY.allStudentGradeGroups(debouncedSearch, page),
    queryFn: () =>
      CourseGroupService.studentGradeGroupList({
        offset: page === 1 ? 0 : (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        sorting: sorting,
        search: debouncedSearch,
      }),
  });

  const { data: courseQueryData } = useQuery<GetCoursesListModel>({
    queryKey: ['student-grade'],
    queryFn: CourseService.list,
    enabled: isCreateEditModalOpen,
  });

  const { mutate: createStudentGradeGroup } = useMutation({
    mutationFn: CourseGroupService.createStudentGradeGroup,
    onSuccess() {
      refetch();
      reset();
      closeCreateEditModal();
    },
  });

  const { mutate: updateStudentGradeGroup } = useMutation({
    mutationFn: CourseGroupService.updateStudentGradeGroup,
    onSuccess() {
      refetch();
      reset();
      closeCreateEditModal();
    },
  });

  const { mutate } = useMutation({
    mutationFn: CourseGroupService.deleteStudentGradeGroup,
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

  const columnHelper = createColumnHelper<CourseGroupSingleModel>();

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

    columnHelper.accessor('id', {
      id: uuidv4(),
      cell: ({ row }) => (
        <ActionButtons>
          <MenuItem
            color="green"
            onClick={() => {
              setSelectedStudentGradeGroup(row.original);
              setValue('title', row.original.title || '');
              setValue('description', row.original.description || '');
              setValue('courseId', row.original.course?.id || '');
              openCreateEditModal();
            }}>
            {t('edit')}
          </MenuItem>
          <MenuItem
            color="red"
            onClick={() => {
              setSelectedStudentGradeGroup(row.original);
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

  const onSubmitHandler = useCallback(
    (data: CreateEditStudentGradeGroupValidation) => {
      if (selectedStudentGradeGroup) {
        updateStudentGradeGroup({ data, id: selectedStudentGradeGroup.id });
      } else {
        createStudentGradeGroup(data);
      }
    },
    [createStudentGradeGroup, selectedStudentGradeGroup, updateStudentGradeGroup],
  );

  return (
    <>
      <SearchTable
        title={'studentGradeGroupList'}
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
      <Modal
        isOpen={isCreateEditModalOpen}
        onClose={closeCreateEditModal}
        title={'studentGradeGroup'}
        primaryAction={handleSubmit(onSubmitHandler)}
        isDisabled={!isValid}
        actionText={selectedStudentGradeGroup ? 'update' : 'create'}>
        <Controller
          name="title"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <FormInput
              isRequired
              name={name}
              type="text"
              formLabelName={'studentGradeGroupName'}
              value={value}
              placeholder={t('enterTitle')}
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
              formLabelName={'studentGradeGroupDescription'}
              value={value}
              placeholder={t('enterDescription')}
              handleInputChange={onChange}
              isInvalid={!!errors.description?.message}
              formErrorMessage={errors.description?.message}
            />
          )}
        />
        <Controller
          name="courseId"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <SelectLabel
              name={name}
              isRequired
              options={courseQueryData || []}
              labelName={'studentGrade'}
              valueLabel="id"
              nameLabel="title"
              onChange={onChange}
              value={value}
              isInvalid={!!errors.courseId?.message}
              formErrorMessage={errors.courseId?.message}
            />
          )}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        isDeleteVariant
        title={'studentGradeGroup'}
        primaryAction={() => {
          if (selectedStudentGradeGroup) {
            mutate(selectedStudentGradeGroup?.id);
          }
        }}
        actionText={'delete'}>
        {t('deleteStudentGradeGroupQuestion')}
      </Modal>
    </>
  );
};

export default StudentGradeGroup;
