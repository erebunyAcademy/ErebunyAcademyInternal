'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { MenuItem, useDisclosure } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { FacultyService } from '@/api/services/faculty.service';
import { StudentGradeService } from '@/api/services/student-grade.service';
import { FormInput, SelectLabel } from '@/components/atoms';
import ActionButtons from '@/components/molecules/ActionButtons';
import Modal from '@/components/molecules/Modal';
import SearchTable from '@/components/organisms/SearchTable';
import useDebounce from '@/hooks/useDebounce';
import { ITEMS_PER_PAGE } from '@/utils/constants/common';
import { QUERY_KEY } from '@/utils/helpers/queryClient';
import { Maybe } from '@/utils/models/common';
import { FacultySignupListModel } from '@/utils/models/faculty';
import { StudentGradeModel } from '@/utils/models/studentGrade';
import { CreateEditStudentGradeValidation } from '@/utils/validation/studentGrade';

const resolver = classValidatorResolver(CreateEditStudentGradeValidation);

const StudentGrades = () => {
  const t = useTranslations();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);
  const [selectedStudentGrade, setSelectedStudentGrade] = useState<Maybe<StudentGradeModel>>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<CreateEditStudentGradeValidation>({
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
      setSelectedStudentGrade(null);
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
      setSelectedStudentGrade(null);
    },
  });

  const { data, isLoading, isPlaceholderData, refetch } = useQuery({
    queryKey: QUERY_KEY.allStudentGrades(debouncedSearch, page),
    queryFn: () =>
      StudentGradeService.studentGradeList({
        offset: page === 1 ? 0 : (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        sorting: sorting,
        search: debouncedSearch,
      }),
  });

  const { mutate: createStudentGrade } = useMutation({
    mutationFn: StudentGradeService.createStudentGrade,
    onSuccess() {
      refetch();
      reset();
      closeCreateEditModal();
    },
  });

  const { mutate: updateStudentGrade } = useMutation({
    mutationFn: StudentGradeService.updateStudentGrade,
    onSuccess() {
      refetch();
      reset();
      closeCreateEditModal();
    },
  });
  const { mutate } = useMutation({
    mutationFn: StudentGradeService.deleteStudentGrade,
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

  const columnHelper = createColumnHelper<StudentGradeModel>();

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
              setSelectedStudentGrade(row.original);
              setValue('title', row.original.title || '');
              setValue('description', row.original.description || '');
              setValue('facultyId', row.original.facultyId || '');
              openCreateEditModal();
            }}>
            {t('edit')}
          </MenuItem>
          <MenuItem
            color="red"
            onClick={() => {
              setSelectedStudentGrade(row.original);
              openDeleteModal();
            }}>
            {t('delete')}
          </MenuItem>
        </ActionButtons>
      ),
      header: t('actions'),
    }),
  ];

  const addNewStudentGradeHandler = useCallback(() => {
    openCreateEditModal();
  }, [openCreateEditModal]);

  const onSubmitHandler = useCallback(
    (data: CreateEditStudentGradeValidation) => {
      if (selectedStudentGrade) {
        updateStudentGrade({ data, id: selectedStudentGrade.id });
      } else {
        createStudentGrade(data);
      }
    },
    [createStudentGrade, selectedStudentGrade, updateStudentGrade],
  );

  return (
    <>
      <SearchTable
        title={t('studentGradeList')}
        isLoading={isLoading}
        data={data?.studentGrades || []}
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
        addNew={addNewStudentGradeHandler}
      />

      <Modal
        isOpen={isCreateEditModalOpen}
        onClose={closeCreateEditModal}
        title={t('studentGrade')}
        primaryAction={handleSubmit(onSubmitHandler)}
        isDisabled={!isDirty}
        actionText={selectedStudentGrade ? t('update') : t('create')}>
        <Controller
          name="title"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <FormInput
              isRequired
              isInvalid={!!errors.title?.message}
              name={name}
              type="text"
              formLabelName={t('studentGradeTitle')}
              value={value}
              placeholder={t('enterTitle')}
              handleInputChange={onChange}
              formErrorMessage={t(errors.title?.message)}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <FormInput
              isInvalid={!!errors.description?.message}
              name={name}
              type="text"
              formLabelName={t('studentGradeDescription')}
              value={value}
              placeholder={t('enterDescription')}
              handleInputChange={onChange}
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
              labelName={t('faculty')}
              valueLabel="id"
              nameLabel="title"
              onChange={onChange}
              value={value}
              isInvalid={!!errors.facultyId?.message}
              formErrorMessage={t(errors.facultyId?.message)}
            />
          )}
        />
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        isDeleteVariant
        onClose={closeDeleteModal}
        title={t('studentGrade')}
        primaryAction={() => {
          if (selectedStudentGrade) {
            mutate(selectedStudentGrade?.id);
          }
        }}
        actionText={t('delete')}>
        {t('deleteStudentGradeQuestion')}
      </Modal>
    </>
  );
};

export default StudentGrades;
