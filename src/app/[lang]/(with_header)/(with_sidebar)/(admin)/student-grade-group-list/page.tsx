'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { MenuItem, useDisclosure } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { StudentGradeGroupService } from '@/api/services/student-grade-group.service';
import { FormInput } from '@/components/atoms';
import ActionButtons from '@/components/molecules/ActionButtons';
import Modal from '@/components/molecules/Modal';
import SearchTable from '@/components/organisms/SearchTable';
import useDebounce from '@/hooks/useDebounce';
import { ITEMS_PER_PAGE } from '@/utils/constants/common';
import { QUERY_KEY } from '@/utils/helpers/queryClient';
import { Maybe } from '@/utils/models/common';
import { StudentGradeGroupModel } from '@/utils/models/studentGradeGroup';
import { CreateEditStudentGradeGroupValidation } from '@/utils/validation/studentGradeGroup';

const resolver = classValidatorResolver(CreateEditStudentGradeGroupValidation);

const StudentGradeGroup = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);
  const [selectedStudentGradeGroup, setSelectedStudentGradeGroup] =
    useState<Maybe<StudentGradeGroupModel>>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateEditStudentGradeGroupValidation>({
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
    queryKey: QUERY_KEY.allUsers(debouncedSearch, page),
    queryFn: () =>
      StudentGradeGroupService.studentGradeGroupList({
        offset: page === 1 ? 0 : (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        sorting: sorting,
        search: debouncedSearch,
      }),
  });

  const { mutate: createStudentGradeGroup } = useMutation({
    mutationFn: StudentGradeGroupService.createStudentGradeGroup,
    onSuccess() {
      refetch();
      reset();
      closeCreateEditModal();
    },
  });

  const { mutate: updateStudentGradeGroup } = useMutation({
    mutationFn: StudentGradeGroupService.updateStudentGradeGroup,
    onSuccess() {
      refetch();
      reset();
      closeCreateEditModal();
    },
  });

  const { mutate } = useMutation({
    mutationFn: StudentGradeGroupService.deleteStudentGradeGroup,
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

  const columnHelper = createColumnHelper<StudentGradeGroupModel>();

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
        <ActionButtons>
          <MenuItem
            color="green"
            onClick={() => {
              setSelectedStudentGradeGroup(row.original);
              setValue('title', row.original.title || '');
              setValue('description', row.original.description || '');
              openCreateEditModal();
            }}>
            Edit
          </MenuItem>
          <MenuItem
            color="red"
            onClick={() => {
              setSelectedStudentGradeGroup(row.original);
              openDeleteModal();
            }}>
            Delete
          </MenuItem>
        </ActionButtons>
      ),
      header: 'Actions',
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
        title="Students Grade Group List"
        isLoading={isLoading}
        data={data?.studentGradeGroups || []}
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
        title="student grade group "
        primaryAction={handleSubmit(onSubmitHandler)}
        actionText={selectedStudentGradeGroup ? 'Update' : 'Create'}>
        <Controller
          name="title"
          control={control}
          rules={{ required: 'Group name is required' }}
          render={({ field: { onChange, value, name } }) => (
            <FormInput
              isRequired
              isInvalid={!!errors.title?.message}
              name={name}
              type="text"
              formLabelName="Student grade group name"
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
          rules={{ required: 'Group description is required' }}
          render={({ field: { onChange, value, name } }) => (
            <FormInput
              isInvalid={!!errors.description?.message}
              name={name}
              type="text"
              formLabelName="Student grade group description"
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
        title="student grade group"
        primaryAction={() => {
          if (selectedStudentGradeGroup) {
            mutate(selectedStudentGradeGroup?.id);
          }
        }}
        actionText="Delete">
        Are you sure you want to delete this grade group
      </Modal>
    </>
  );
};

export default StudentGradeGroup;
