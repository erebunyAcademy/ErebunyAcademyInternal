'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { MenuItem, useDisclosure } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { SubjectCategoryService } from '@/api/services/subject-category.service';
import { SubjectService } from '@/api/services/subject.service';
import { FormInput, SelectLabel } from '@/components/atoms';
import ActionButtons from '@/components/molecules/ActionButtons';
import Modal from '@/components/molecules/Modal';
import SearchTable from '@/components/organisms/SearchTable';
import useDebounce from '@/hooks/useDebounce';
import { ITEMS_PER_PAGE } from '@/utils/constants/common';
import { QUERY_KEY } from '@/utils/helpers/queryClient';
import { Maybe } from '@/utils/models/common';
import { SubjectSignupListModel } from '@/utils/models/subject';
import { SubjectCategoryModel } from '@/utils/models/subjectCategory';
import { CreateEditSubjectCategoryValidation } from '@/utils/validation/subjectCategory';

const resolver = classValidatorResolver(CreateEditSubjectCategoryValidation);

const SubjectCategories = () => {
  const t = useTranslations();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);
  const [selectedSubjectCategory, setSelectedSubjectCategory] =
    useState<Maybe<SubjectCategoryModel>>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreateEditSubjectCategoryValidation>({
    resolver,
    defaultValues: {
      title: '',
      description: '',
      subjectId: '',
    },
  });

  const {
    isOpen: isCreateEditModalOpen,
    onOpen: openCreateEditModal,
    onClose: closeCreateEditModal,
  } = useDisclosure({
    onClose() {
      reset();
      setSelectedSubjectCategory(null);
    },
  });

  const { data: subjectQueryData } = useQuery<SubjectSignupListModel>({
    queryKey: ['subject'],
    queryFn: SubjectService.list,
    enabled: isCreateEditModalOpen,
  });

  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal,
  } = useDisclosure({
    onClose() {
      setSelectedSubjectCategory(null);
    },
  });

  const { data, isLoading, isPlaceholderData, refetch } = useQuery({
    queryKey: QUERY_KEY.allSubjectCategories(debouncedSearch, page),
    queryFn: () =>
      SubjectCategoryService.subjectCategoryList({
        offset: page === 1 ? 0 : (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        sorting: sorting,
        search: debouncedSearch,
      }),
  });

  const { mutate: createSubjectCategory } = useMutation({
    mutationFn: SubjectCategoryService.createSubjectCategory,
    onSuccess() {
      refetch();
      reset();
      closeCreateEditModal();
    },
  });

  const { mutate: updateSubjectCategory } = useMutation({
    mutationFn: SubjectCategoryService.updateSubjectCategory,
    onSuccess() {
      refetch();
      reset();
      closeCreateEditModal();
    },
  });
  const { mutate } = useMutation({
    mutationFn: SubjectCategoryService.deleteSubjectCategory,
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

  const columnHelper = createColumnHelper<SubjectCategoryModel>();

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
              setSelectedSubjectCategory(row.original);
              setValue('title', row.original.title || '');
              setValue('description', row.original.description || '');
              setValue('subjectId', row.original.subjectId || '');
              openCreateEditModal();
            }}>
            {t('edit')}
          </MenuItem>
          <MenuItem
            color="red"
            onClick={() => {
              setSelectedSubjectCategory(row.original);
              openDeleteModal();
            }}>
            {t('delete')}
          </MenuItem>
        </ActionButtons>
      ),
      header: t('actions'),
    }),
  ];

  const addNewSubjectCategoryHandler = useCallback(() => {
    openCreateEditModal();
  }, [openCreateEditModal]);

  const onSubmitHandler = useCallback(
    (data: CreateEditSubjectCategoryValidation) => {
      if (selectedSubjectCategory) {
        updateSubjectCategory({ data, id: selectedSubjectCategory.id });
      } else {
        createSubjectCategory(data);
      }
    },
    [createSubjectCategory, selectedSubjectCategory, updateSubjectCategory],
  );

  return (
    <>
      <SearchTable
        title={t('subjectCategoryList')}
        isLoading={isLoading}
        data={data?.subjectCategories || []}
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
        addNew={addNewSubjectCategoryHandler}
      />

      <Modal
        isOpen={isCreateEditModalOpen}
        onClose={closeCreateEditModal}
        title={t('subjectCategory')}
        primaryAction={handleSubmit(onSubmitHandler)}
        isDisabled={!isValid}
        actionText={selectedSubjectCategory ? t('update') : t('create')}>
        <Controller
          name="title"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <FormInput
              isRequired
              isInvalid={!!errors.title?.message}
              name={name}
              type="text"
              formLabelName={t('subjectCategoryTitle')}
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
              formLabelName={t('subjectCategoryDescription')}
              value={value}
              placeholder={t('enterDescription')}
              handleInputChange={onChange}
              formErrorMessage={errors.description?.message}
            />
          )}
        />
        <Controller
          name="subjectId"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <SelectLabel
              name={name}
              isRequired
              options={subjectQueryData || []}
              labelName={t('subject')}
              valueLabel="id"
              nameLabel="title"
              onChange={onChange}
              value={value}
              isInvalid={!!errors.subjectId?.message}
              formErrorMessage={t(errors.subjectId?.message)}
            />
          )}
        />
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        isDeleteVariant
        onClose={closeDeleteModal}
        title={t('subjectCategory')}
        primaryAction={() => {
          if (selectedSubjectCategory) {
            mutate(selectedSubjectCategory?.id);
          }
        }}
        actionText={t('delete')}>
        {t('deleteSubjectCategoryQuestion')}
      </Modal>
    </>
  );
};

export default SubjectCategories;
