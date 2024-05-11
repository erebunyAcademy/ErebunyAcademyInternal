'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { IconButton, Menu, MenuButton, MenuItem, MenuList, useDisclosure } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { StudentGradeService } from '@/api/services/student-grade.service';
import { FormInput } from '@/components/atoms';
import Modal from '@/components/molecules/Modal';
import SearchTable from '@/components/organisms/SearchTable';
import useDebounce from '@/hooks/useDebounce';
import DotsIcon from '@/icons/dots-horizontal.svg';
import { ITEMS_PER_PAGE } from '@/utils/constants/common';
import { QUERY_KEY } from '@/utils/helpers/queryClient';
import { Maybe } from '@/utils/models/common';
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
    formState: { errors },
  } = useForm<CreateEditStudentGradeValidation>({
    resolver,
    defaultValues: {
      title: '',
      description: '',
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
    queryKey: QUERY_KEY.allUsers(debouncedSearch, page),
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
      header: 'Title',
    }),
    columnHelper.accessor('description', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: 'Description',
    }),

    columnHelper.accessor('createdAt', {
      id: uuidv4(),
      cell: info => {
        const currentDate = dayjs(info.getValue());
        return currentDate.format('YYYY-MM-DD HH:mm:ss');
      },
      header: 'Created At',
    }),
    columnHelper.accessor('id', {
      id: uuidv4(),
      cell: ({ row }) => (
        <Menu>
          <MenuButton as={IconButton} icon={<DotsIcon />} />
          <MenuList>
            <MenuItem
              color="green"
              onClick={() => {
                setSelectedStudentGrade(row.original);
                setValue('title', row.original.title || '');
                setValue('description', row.original.description || '');
                openCreateEditModal();
              }}>
              Edit
            </MenuItem>
            <MenuItem
              color="red"
              onClick={() => {
                setSelectedStudentGrade(row.original);
                openDeleteModal();
              }}>
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      ),
      header: 'Actions',
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

  console.log(t('common.deleteItem'));

  return (
    <>
      <SearchTable
        title="Students Grade List"
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
        title="student grade"
        primaryAction={handleSubmit(onSubmitHandler)}
        actionText={selectedStudentGrade ? 'Update' : 'Create'}>
        <Controller
          name="title"
          control={control}
          rules={{ required: 'This field is required' }}
          render={({ field: { onChange, value, name } }) => (
            <FormInput
              isRequired
              isInvalid={!!errors.title?.message}
              name={name}
              type="text"
              formLabelName="Student grade title"
              value={value}
              placeholder="Please enter title"
              handleInputChange={onChange}
              formErrorMessage={errors.title?.message}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          rules={{ required: 'This field is required' }}
          render={({ field: { onChange, value, name } }) => (
            <FormInput
              isInvalid={!!errors.description?.message}
              name={name}
              type="text"
              formLabelName="Student grade description"
              value={value}
              placeholder="Please enter description"
              handleInputChange={onChange}
              formErrorMessage={errors.description?.message}
            />
          )}
        />
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="student grade"
        primaryAction={() => {
          if (selectedStudentGrade) {
            mutate(selectedStudentGrade?.id);
          }
        }}
        actionText="Delete">
        {t('common.deleteItem', { element: 'Student' })}
      </Modal>
    </>
  );
};

export default StudentGrades;
