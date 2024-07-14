'use client';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormLabel,
  IconButton,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { ScheduleService } from '@/api/services/schedule.service';
import { SubjectService } from '@/api/services/subject.service';
import { TeacherService } from '@/api/services/teacher.service';
import { FormInput, SelectLabel } from '@/components/atoms';
import Modal from '@/components/molecules/Modal';
import SearchTable from '@/components/organisms/SearchTable';
import useDebounce from '@/hooks/useDebounce';
import { ITEMS_PER_PAGE } from '@/utils/constants/common';
import { QUERY_KEY } from '@/utils/helpers/queryClient';
import { Maybe } from '@/utils/models/common';
import { ScheduleListModel, ScheduleSingleModel } from '@/utils/models/schedule';
import { TeacherDataModel } from '@/utils/models/teachers';
import { CreateEditScheduleValidation } from '@/utils/validation/schedule';

const resolver = classValidatorResolver(CreateEditScheduleValidation);

export default function Schedule() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedSchedule, setSelectedSchedule] = useState<Maybe<ScheduleSingleModel>>(null);
  const [files, setFiles] = useState<Maybe<File[]>>(null);
  const debouncedSearch = useDebounce(search);
  const t = useTranslations();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEditScheduleValidation>({
    resolver,
    defaultValues: {
      totalHours: '',
      subjectId: '',
      title: '',
      description: '',
      startDayDate: '',
      examDate: '',
      endDayDate: '',
      isAssessment: false,
      teacherId: '',
      links: [
        {
          link: '',
        },
      ],
      theoreticalClass: {
        totalHours: '',
        classDescriptionRow: [{ title: '', hour: '' }],
      },
      practicalClass: {
        totalHours: '',
        classDescriptionRow: [{ title: '', hour: '' }],
      },
    },
  });

  console.log({ errors });

  const {
    fields: theoreticalClassFields,
    append: appendTheoreticalClass,
    remove: removeTheoreticalClass,
  } = useFieldArray({
    control,
    name: 'theoreticalClass.classDescriptionRow',
  });

  const {
    fields: practicalClassFields,
    append: appendPracticalClass,
    remove: removePracticalClass,
  } = useFieldArray({
    control,
    name: 'practicalClass.classDescriptionRow',
  });

  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({
    control,
    name: 'links',
  });

  const {
    isOpen: isCreateEditModalOpen,
    onOpen: openCreateEditModal,
    onClose: closeCreateEditModal,
  } = useDisclosure({
    onClose() {
      reset();
      setSelectedSchedule(null);
    },
  });

  const { data: subjectList } = useQuery({
    queryKey: ['subject-list'],
    queryFn: SubjectService.list,
  });

  const { data: teachersQueryData } = useQuery<TeacherDataModel>({
    queryKey: ['teachers'],
    queryFn: TeacherService.getTeachers,
    enabled: isCreateEditModalOpen,
  });

  const teacherListData = (teachersQueryData || [])?.map(teacher => ({
    id: teacher.teacher?.id,
    title: `${teacher.firstName} ${teacher.lastName}`,
  }));

  const { mutate: createSchedule } = useMutation({
    mutationFn: ScheduleService.createSchedule,
    mutationKey: ['create-schedule'],
  });

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: QUERY_KEY.allTeachers(debouncedSearch, page),
    queryFn: () =>
      ScheduleService.list({
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

  const columnHelper = createColumnHelper<ScheduleListModel>();

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
    columnHelper.accessor('totalHours', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('lastName'),
    }),
    columnHelper.accessor('isAssessment', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('lastName'),
    }),
  ];

  const onFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      setFiles(Array.from(files));
    }
  };

  const onSubmitHandler = useCallback(
    (data: CreateEditScheduleValidation) => {
      createSchedule(data);
    },
    [createSchedule],
  );

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles?.filter((_, i) => i !== index) || null);
  };
  console.log(files);

  return (
    <>
      <SearchTable
        title="scheduleList"
        isLoading={isLoading}
        data={data?.schedules || []}
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

      <Modal
        isOpen={isCreateEditModalOpen}
        onClose={closeCreateEditModal}
        title="schedule"
        size="full"
        primaryAction={handleSubmit(onSubmitHandler)}
        // isDisabled={!isValid}
        actionText={selectedSchedule ? 'edit' : 'create'}>
        <Flex gap={5}>
          <Controller
            name="title"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <FormInput
                isRequired
                name={name}
                type="text"
                formLabelName={t('title')}
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
                formLabelName={t('description')}
                value={value}
                placeholder="enterDescription"
                handleInputChange={onChange}
                isInvalid={!!errors.description?.message}
                formErrorMessage={errors.description?.message}
              />
            )}
          />
          <Controller
            name="totalHours"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <FormInput
                name={name}
                type="number"
                formLabelName={t('totalHours')}
                value={value}
                placeholder="totalHours"
                handleInputChange={onChange}
                isInvalid={!!errors.description?.message}
                formErrorMessage={errors.description?.message}
              />
            )}
          />
        </Flex>
        <Flex gap={5}>
          <Controller
            name="startDayDate"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <FormInput
                isRequired
                isInvalid={!!errors[name]?.message}
                name={name}
                type="date"
                formLabelName="Start day"
                value={value}
                handleInputChange={onChange}
                formErrorMessage={errors[name]?.message}
              />
            )}
          />

          <Controller
            name="examDate"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <FormInput
                isRequired
                isInvalid={!!errors[name]?.message}
                name={name}
                type="date"
                formLabelName="exam day"
                value={value}
                handleInputChange={onChange}
                formErrorMessage={errors[name]?.message}
              />
            )}
          />

          <Controller
            name="endDayDate"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <FormInput
                isRequired
                name={name}
                isInvalid={!!errors[name]?.message}
                type="date"
                formLabelName="End day"
                value={value}
                handleInputChange={onChange}
                formErrorMessage={errors[name]?.message}
              />
            )}
          />
          <Controller
            name="teacherId"
            control={control}
            render={({ field: { onChange, value, name } }) => (
              <SelectLabel
                name={name}
                isRequired
                options={teacherListData as any}
                labelName="teacher"
                valueLabel="id"
                nameLabel="title"
                onChange={onChange}
                value={value}
                isInvalid={!!errors[name]?.message}
                formErrorMessage={errors[name]?.message}
              />
            )}
          />
        </Flex>

        <Flex gap={5}>
          <Flex width={{ base: '100%', xl: '50%' }}>
            <Controller
              name="subjectId"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <SelectLabel
                  isRequired
                  name={name}
                  options={subjectList || []}
                  labelName="selectSubject"
                  valueLabel="id"
                  nameLabel="title"
                  onChange={onChange}
                  value={value}
                  isInvalid={!!errors.subjectId?.message}
                  formErrorMessage={errors.subjectId?.message}
                />
              )}
            />
          </Flex>
          <Flex flexDirection="column">
            <FormLabel
              fontWeight={600}
              marginBottom={4}
              lineHeight="20px"
              fontSize={14}
              color="#222">
              Assessment
              <Text as="span" color="#222">
                *
              </Text>
            </FormLabel>

            <Controller
              name="isAssessment"
              control={control}
              rules={{ required: 'This is required' }}
              render={({ field: { onChange, value, name } }) => (
                <Stack>
                  <RadioGroup
                    display="flex"
                    gap={5}
                    name={name}
                    onChange={val => onChange(val === 'true')}
                    value={value ? 'true' : 'false'}>
                    <Radio value="true">Yes</Radio>
                    <Radio value="false">No</Radio>
                  </RadioGroup>
                </Stack>
              )}
            />
          </Flex>
        </Flex>

        <Flex gap={5} justifyContent="space-between">
          <Box mt={5}>
            <Text fontSize="lg" fontWeight="bold">
              Links
            </Text>
            {linkFields.map((field, index) => (
              <Flex key={field.id} gap={5} alignItems="center">
                <Controller
                  name={`links.${index}.link`}
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      name={field.name}
                      type="url"
                      formLabelName="Link"
                      value={field.value}
                      placeholder="Enter link"
                      handleInputChange={field.onChange}
                      isInvalid={!!errors.links?.[index]?.message}
                      formErrorMessage={errors.links?.[index]?.message}
                    />
                  )}
                />
                <IconButton
                  aria-label="Delete link"
                  icon={<DeleteIcon />}
                  onClick={() => removeLink(index)}
                />
              </Flex>
            ))}
            <Button mt={2} onClick={() => appendLink({ link: '' })} leftIcon={<AddIcon />}>
              Add Link
            </Button>
          </Box>

          <Flex flexDirection="column" gap={5} alignItems="flex-end">
            <Box mt={3}>
              {files && (
                <Stack spacing={3}>
                  {files.map((file: File, index: number) => (
                    <Flex key={index} alignItems="center">
                      <Text>{file.name}</Text>
                      <IconButton
                        aria-label="Delete file"
                        icon={<DeleteIcon />}
                        onClick={() => removeFile(index)}
                        ml={2}
                      />
                    </Flex>
                  ))}
                </Stack>
              )}
            </Box>
            <Box
              cursor="pointer"
              position="relative"
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              height="22px"
              ml="5px">
              <Button
                fontWeight={500}
                height="100%"
                width="auto"
                cursor="pointer"
                color="#1F1646"
                backgroundColor="#fff"
                _hover={{
                  color: '#1F1646',
                  backgroundColor: '#fff',
                }}
                _focus={{
                  color: '#1F1646',
                  backgroundColor: '#fff',
                }}>
                <Input
                  as="input"
                  name="attachments"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
                  width="100%"
                  multiple
                  position="absolute"
                  left={0}
                  right={0}
                  bottom={0}
                  opacity={0}
                  cursor="pointer"
                  onChange={onFileSelect}
                  value={files ? '' : undefined}
                  color="#1F1646"
                  backgroundColor="#fff"
                  _hover={{
                    color: '#1F1646',
                    backgroundColor: '#fff',
                  }}
                  _focus={{
                    color: '#1F1646',
                    backgroundColor: '#fff',
                  }}
                />
                {t('uploadDocument')}*
              </Button>
            </Box>
          </Flex>
        </Flex>

        <Box mt={5}>
          <Text fontSize="lg" fontWeight="bold">
            Theoretical Classes
          </Text>

          <Flex width="33%">
            <Controller
              name="theoreticalClass.totalHours"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <FormInput
                  isRequired
                  name={name}
                  isInvalid={!!errors.theoreticalClass?.totalHours?.message}
                  type="number"
                  formLabelName="Total hour"
                  value={value}
                  handleInputChange={onChange}
                  formErrorMessage={errors.theoreticalClass?.totalHours?.message}
                />
              )}
            />
          </Flex>

          {theoreticalClassFields.map((field, index) => (
            <Flex key={field.id} gap={5} alignItems="center">
              <Controller
                name={`theoreticalClass.classDescriptionRow.${index}.title`}
                control={control}
                render={({ field }) => (
                  <FormInput
                    name={field.name}
                    type="text"
                    formLabelName="Title"
                    value={field.value}
                    placeholder="Enter title"
                    handleInputChange={field.onChange}
                    isInvalid={
                      !!errors.theoreticalClass?.classDescriptionRow?.[index]?.title?.message
                    }
                    formErrorMessage={
                      errors.theoreticalClass?.classDescriptionRow?.[index]?.title?.message
                    }
                  />
                )}
              />
              <Controller
                name={`theoreticalClass.classDescriptionRow.${index}.hour`}
                control={control}
                render={({ field }) => (
                  <FormInput
                    name={field.name}
                    type="number"
                    formLabelName="Hours"
                    value={field.value}
                    placeholder="Enter hours"
                    handleInputChange={field.onChange}
                    isInvalid={
                      !!errors.theoreticalClass?.classDescriptionRow?.[index]?.hour?.message
                    }
                    formErrorMessage={
                      errors.theoreticalClass?.classDescriptionRow?.[index]?.hour?.message
                    }
                  />
                )}
              />
              <IconButton
                aria-label="Delete row"
                colorScheme="red"
                alignSelf="flex-end"
                icon={<DeleteIcon />}
                onClick={() => removeTheoreticalClass(index)}
              />
            </Flex>
          ))}
          <Button
            mt={2}
            onClick={() => appendTheoreticalClass({ title: '', hour: '' })}
            leftIcon={<AddIcon />}>
            Add Theoretical Class
          </Button>
        </Box>

        <Box mt={5}>
          <Text fontSize="lg" fontWeight="bold">
            Practical Classes
          </Text>
          <Flex width="33%">
            <Controller
              name="practicalClass.totalHours"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <FormInput
                  isRequired
                  name={name}
                  isInvalid={!!errors.practicalClass?.totalHours?.message}
                  type="number"
                  formLabelName="Total hour"
                  value={value}
                  handleInputChange={onChange}
                  formErrorMessage={errors.practicalClass?.totalHours?.message}
                />
              )}
            />
          </Flex>

          {practicalClassFields.map((field, index) => (
            <Flex key={field.id} gap={5} alignItems="center">
              <Controller
                name={`practicalClass.classDescriptionRow.${index}.title`}
                control={control}
                render={({ field }) => (
                  <FormInput
                    name={field.name}
                    type="text"
                    formLabelName="Title"
                    value={field.value}
                    placeholder="Enter title"
                    handleInputChange={field.onChange}
                    isInvalid={
                      !!errors.practicalClass?.classDescriptionRow?.[index]?.title?.message
                    }
                    formErrorMessage={
                      errors.practicalClass?.classDescriptionRow?.[index]?.title?.message
                    }
                  />
                )}
              />
              <Controller
                name={`practicalClass.classDescriptionRow.${index}.hour`}
                control={control}
                render={({ field }) => (
                  <FormInput
                    name={field.name}
                    type="text"
                    formLabelName="Hours"
                    value={field.value}
                    placeholder="Enter hours"
                    handleInputChange={field.onChange}
                    isInvalid={!!errors.practicalClass?.classDescriptionRow?.[index]?.hour?.message}
                    formErrorMessage={
                      errors.practicalClass?.classDescriptionRow?.[index]?.hour?.message
                    }
                  />
                )}
              />
              <IconButton
                aria-label="Delete row"
                colorScheme="red"
                alignSelf="flex-end"
                icon={<DeleteIcon />}
                onClick={() => removePracticalClass(index)}
              />
            </Flex>
          ))}
          <Button
            mt={2}
            onClick={() => appendPracticalClass({ title: '', hour: '' })}
            leftIcon={<AddIcon />}>
            Add Practical Class
          </Button>
        </Box>
      </Modal>
    </>
  );
}
