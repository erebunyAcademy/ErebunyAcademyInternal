'use client';
import { useCallback, useMemo, useState } from 'react';
import { MenuItem, useDisclosure } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { SubjectService } from '@/api/services/subject.service';
import { FormInput } from '@/components/atoms';
import ActionButtons from '@/components/molecules/ActionButtons';
import Modal from '@/components/molecules/Modal';
import SearchTable from '@/components/organisms/SearchTable';
import useDebounce from '@/hooks/useDebounce';
import { ITEMS_PER_PAGE } from '@/utils/constants/common';
import { QUERY_KEY } from '@/utils/helpers/queryClient';
import { Maybe } from '@/utils/models/common';
import { SubjectModel } from '@/utils/models/subject';
import { CreateEditSubjectValidation } from '@/utils/validation/subject';

const resolver = classValidatorResolver(CreateEditSubjectValidation);

const Subject = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);
  const [selectedSubject, setSelectedSubject] = useState<Maybe<SubjectModel>>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateEditSubjectValidation>({
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
        sorting: sorting,
        search: debouncedSearch,
      }),
  });

  const { mutate: createFaculty } = useMutation({
    mutationFn: SubjectService.createSubject,
    onSuccess() {
      refetch();
      reset();
      closeCreateEditModal();
    },
  });

  const { mutate: updateFaculty } = useMutation({
    mutationFn: SubjectService.updateSubject,
    onSuccess() {
      refetch();
      reset();
      closeCreateEditModal();
    },
  });

  const { mutate } = useMutation({
    mutationFn: SubjectService.deleteSubject,
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

  const columnHelper = createColumnHelper<SubjectModel>();
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
              setSelectedSubject(row.original);
              setValue('title', row.original.title || '');
              setValue('description', row.original.description || '');
              openCreateEditModal();
            }}>
            Edit
          </MenuItem>
          <MenuItem
            color="red"
            onClick={() => {
              setSelectedSubject(row.original);
              openDeleteModal();
            }}>
            Delete
          </MenuItem>
        </ActionButtons>
      ),
      header: 'Actions',
    }),
  ];

  const addNewFacultyHandler = useCallback(() => {
    openCreateEditModal();
  }, [openCreateEditModal]);

  const onSubmitHandler = useCallback(
    (data: CreateEditSubjectValidation) => {
      if (selectedSubject) {
        updateFaculty({ data, id: selectedSubject.id });
      } else {
        createFaculty(data);
      }
    },
    [createFaculty, selectedSubject, updateFaculty],
  );

  return (
    <>
      <SearchTable
        title="Subject List"
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
        addNew={addNewFacultyHandler}
      />

      <Modal
        isOpen={isCreateEditModalOpen}
        onClose={closeCreateEditModal}
        title="Subject"
        primaryAction={handleSubmit(onSubmitHandler)}
        actionText={selectedSubject ? 'Update' : 'Create'}>
        <Controller
          name="title"
          control={control}
          rules={{ required: 'Subject name is required' }}
          render={({ field: { onChange, value, name } }) => (
            <FormInput
              isRequired
              isInvalid={!!errors.title?.message}
              name={name}
              type="text"
              formLabelName="Subject name"
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
          rules={{ required: 'Subject description is required' }}
          render={({ field: { onChange, value, name } }) => (
            <FormInput
              isInvalid={!!errors.description?.message}
              name={name}
              type="text"
              formLabelName="Subject Description"
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
        title="Subject"
        primaryAction={() => {
          if (selectedSubject) {
            mutate(selectedSubject?.id);
          }
        }}
        actionText="Delete">
        Are you sure you want to delete this subject
      </Modal>
    </>
  );
};

export default Subject;
