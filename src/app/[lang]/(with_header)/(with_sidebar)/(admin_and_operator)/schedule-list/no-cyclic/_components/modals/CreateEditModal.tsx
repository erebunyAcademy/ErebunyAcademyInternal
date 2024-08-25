'use client';
import React, { ChangeEvent, FC, useCallback, useMemo, useState } from 'react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, Button, Divider, Flex, IconButton, Input, Stack, Text } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { ScheduleTypeEnum } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { CourseGroupService } from '@/api/services/course-group.service';
import { ScheduleService } from '@/api/services/schedule.service';
import { SubjectService } from '@/api/services/subject.service';
import { TeacherService } from '@/api/services/teacher.service';
import { UserService } from '@/api/services/user.service';
import { FormInput, SelectLabel } from '@/components/atoms';
import Modal from '@/components/molecules/Modal';
import {
  academicYearListData,
  periodListData,
  scheduleExamType,
  weekendDayList,
} from '@/utils/constants/common';
import { generateAWSUrl } from '@/utils/helpers/aws';
import { Maybe } from '@/utils/models/common';
import { GetCourseGroupsBySubjectId } from '@/utils/models/courseGroup';
import { ScheduleSingleModel } from '@/utils/models/schedule';
import { TeacherDataModel } from '@/utils/models/teachers';
import { AttachmentValidation } from '@/utils/validation';
import { CreateEditNonCyclicScheduleValidation } from '@/utils/validation/non-cyclic';

type CreateEditModalProps = {
  isModalOpen: boolean;
  closeModal: () => void;
  selectedSchedule: Maybe<ScheduleSingleModel>;
};

const resolver = classValidatorResolver(CreateEditNonCyclicScheduleValidation);

type FileWithLocalUrl = {
  file: File;
  localUrl: string;
};

const CreateEditModal: FC<CreateEditModalProps> = ({
  isModalOpen,
  closeModal,
  selectedSchedule,
}) => {
  const t = useTranslations();
  const [files, setFiles] = useState<Maybe<FileWithLocalUrl[]>>(null);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateEditNonCyclicScheduleValidation>({
    resolver,
    defaultValues: {
      totalHours: '',
      subjectId: '',
      title: '',
      description: '',
      examType: 'ASSESSMENT',
      teacherId: '',
      courseGroupId: '',
      attachments: [],
      links: [],
      academicYear: '2024-2025',
      availableDays: [{ dayOfWeek: 0, lessonOfTheDay: 1 }],
    },
  });

  console.log({ errors });

  const { data: teachersQueryData } = useQuery<TeacherDataModel>({
    queryKey: ['teachers'],
    queryFn: TeacherService.getTeachers,
    enabled: isModalOpen,
  });

  const { mutate: createEditSchedule } = useMutation({
    mutationFn: (data: CreateEditNonCyclicScheduleValidation) =>
      ScheduleService[selectedSchedule ? 'updateSchedule' : 'createSchedule'](
        data,
        ScheduleTypeEnum.NON_CYCLIC,
      ),
    mutationKey: ['create-schedule'],
    onSuccess() {
      reset();
      closeModal();
    },
  });

  const courseId = watch('subjectId');

  const { data: courseGroupQueryData } = useQuery<GetCourseGroupsBySubjectId>({
    queryKey: ['course-group'],
    queryFn: () => CourseGroupService.getCourseGroupsBySubjectId(courseId),
    enabled: !!courseId,
  });

  const { data: subjectList } = useQuery({
    queryKey: ['subject-list'],
    queryFn: SubjectService.list,
  });

  const subjectCourseNameList = (subjectList || []).map(subject => ({
    id: subject.id,
    title: `${subject.title} (${subject.course?.title})`,
  }));

  const teacherListData = useMemo(
    () =>
      (teachersQueryData || []).map(teacher => ({
        id: teacher.teacher?.id,
        title: `${teacher.firstName} ${teacher.lastName}`,
      })),
    [teachersQueryData],
  );

  useMemo(() => {
    if (selectedSchedule) {
      const attachmentWithUrls = selectedSchedule.attachment.map(attachment => ({
        key: generateAWSUrl(attachment.key),
        mimetype: attachment.mimetype,
        title: attachment.title || '',
      }));

      setFiles(
        attachmentWithUrls.map(att => ({
          file: new File([], att.title),
          localUrl: att.key,
        })),
      );

      reset({
        availableDays: selectedSchedule.availableDays,
        totalHours: selectedSchedule.totalHours.toString(),
        subjectId: selectedSchedule.subjectId,
        title: selectedSchedule.title,
        description: selectedSchedule.description || '',
        teacherId: selectedSchedule.scheduleTeachers[0].teacherId,
        examType: selectedSchedule.examType,
        courseGroupId: selectedSchedule.courseGroupId,
        academicYear: selectedSchedule.academicYear,
        attachments: selectedSchedule.attachment.map(attachment => ({
          key: attachment.key,
          mimetype: attachment.mimetype,
          title: attachment.title || '',
        })),
        links: (Array.isArray(selectedSchedule.links) ? selectedSchedule.links : ([] as any)).map(
          (link: string) => ({ link }),
        ),
      });
    }
  }, [reset, selectedSchedule]);

  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({
    control,
    name: 'links',
  });

  const {
    fields: availableDayFields,
    append: appendAvailableDay,
    remove: removeAvailableDay,
  } = useFieldArray({
    control,
    name: 'availableDays',
  });

  const onFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles?.length) {
      const fileArray = Array.from(selectedFiles).map(file => {
        const localUrl = URL.createObjectURL(file);
        return { file, localUrl };
      });
      setFiles(fileArray);
    }
  };

  const onSubmitHandler = useCallback(
    (data: CreateEditNonCyclicScheduleValidation) => {
      const attachmentKeys: AttachmentValidation[] = [];

      files?.forEach(async ({ file }) => {
        const attachmentId = uuidv4();
        const key = `attachments/${attachmentId}/subjects/${data.subjectId}/${Date.now()}_${file.name}`;

        const formData = new FormData();
        formData.append('file', file);

        attachmentKeys.push({
          title: file.name,
          key,
          mimetype: file.type,
          attachmentKey: '',
        });

        const { url } = await UserService.getPreSignedUrl(key);
        await axios.put(url, file);
      });

      if (
        selectedSchedule?.attachment &&
        selectedSchedule?.attachment.length > 0 &&
        files?.length === 0
      ) {
        data.attachments = [];
      } else if ((files || [])?.length > 0) {
        data.attachments = attachmentKeys;
      }

      if (selectedSchedule) {
        data.id = selectedSchedule.id;
      }

      createEditSchedule(data);
    },
    [createEditSchedule, files, selectedSchedule],
  );

  const removeFile = (localUrl: string) => {
    setFiles(prevFiles => prevFiles?.filter(file => file.localUrl !== localUrl) || null);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      isDisabled={!isValid}
      title="notCyclicSchedule"
      size="6xl"
      primaryAction={handleSubmit(onSubmitHandler)}
      actionText={selectedSchedule ? 'edit' : 'create'}>
      <Flex gap={5} flexDirection={{ base: 'column', md: 'row' }}>
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
              isRequired
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

        <Controller
          name="examType"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <SelectLabel
              name={name}
              isRequired
              options={scheduleExamType || []}
              labelName="examType"
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

      <Flex gap={5} flexDirection={{ base: 'column', lg: 'row' }}>
        <Controller
          name="teacherId"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <SelectLabel
              name={name}
              isRequired
              options={teacherListData as any}
              labelName="lecturer"
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

      <Flex gap={5} flexDirection={{ base: 'column', sm: 'row' }}>
        <Controller
          name="subjectId"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <SelectLabel
              isRequired
              name={name}
              options={subjectCourseNameList}
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
        <Controller
          name="courseGroupId"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <SelectLabel
              name={name}
              isRequired
              options={courseGroupQueryData?.course?.groups || []}
              labelName="courseGroup"
              valueLabel="id"
              nameLabel="title"
              onChange={onChange}
              value={value}
              isInvalid={!!errors[name]?.message}
              formErrorMessage={errors[name]?.message}
            />
          )}
        />
        <Controller
          name="academicYear"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <SelectLabel
              name={name}
              isRequired
              options={academicYearListData}
              labelName="academicYear"
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
      <Flex gap={32} flexDirection="column">
        {availableDayFields.map((field, index: number) => (
          <Flex key={field.id} gap={24}>
            <Controller
              name={`availableDays.${index}.dayOfWeek`}
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <SelectLabel
                  name={name}
                  isRequired
                  options={weekendDayList}
                  labelName="weekDay"
                  valueLabel="id"
                  nameLabel="title"
                  onChange={e => onChange(+e.target.value)}
                  value={value}
                  isInvalid={!!errors.availableDays?.[index]?.message}
                  formErrorMessage={errors.availableDays?.[index]?.message}
                />
              )}
            />
            <Controller
              name={`availableDays.${index}.lessonOfTheDay`}
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <SelectLabel
                  name={name}
                  isRequired
                  options={periodListData}
                  labelName="lessonOfTheDay"
                  valueLabel="id"
                  nameLabel="title"
                  onChange={e => onChange(Number(e.target.value))}
                  value={value}
                  isInvalid={!!errors.availableDays?.[index]?.message}
                  formErrorMessage={errors.availableDays?.[index]?.message}
                />
              )}
            />

            <IconButton
              mt="20px"
              size="md"
              colorScheme="red"
              aria-label="Delete link"
              icon={<DeleteIcon />}
              onClick={() => removeAvailableDay(index)}
            />
          </Flex>
        ))}
        <Button
          mt={2}
          onClick={() => appendAvailableDay({ dayOfWeek: 0, lessonOfTheDay: 1 })}
          leftIcon={<AddIcon />}>
          {t('addClassDay')}
        </Button>
      </Flex>
      <Divider />

      <Flex gap={5} justifyContent="space-between" flexDirection={{ base: 'column', md: 'row' }}>
        <Box mt={5}>
          <Text fontSize="lg" fontWeight="bold" mb="10px">
            {t('links')}
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
                    formLabelName={t('link')}
                    value={field.value}
                    placeholder="enterLink"
                    handleInputChange={field.onChange}
                    isInvalid={!!errors.links?.[index]?.message}
                    formErrorMessage={errors.links?.[index]?.message}
                  />
                )}
              />
              <IconButton
                mt="20px"
                size="md"
                colorScheme="red"
                aria-label="Delete link"
                icon={<DeleteIcon />}
                onClick={() => removeLink(index)}
              />
            </Flex>
          ))}
          <Button mt={2} onClick={() => appendLink({ link: '' })} leftIcon={<AddIcon />}>
            {t('addLink')}
          </Button>
        </Box>

        <Flex flexDirection="column" gap={5} alignItems={{ base: 'flex-start', md: 'flex-end' }}>
          <Box mt={3}>
            {files && (
              <Stack spacing={3}>
                {files.map((fileObj, index) => (
                  <Flex key={index} alignItems="center" justifyContent="space-between">
                    <Text as="a" href={fileObj.localUrl} download={fileObj.file.name}>
                      {fileObj.file.name}
                    </Text>
                    <IconButton
                      size="md"
                      colorScheme="red"
                      aria-label="Delete file"
                      icon={<DeleteIcon />}
                      onClick={() => removeFile(fileObj.localUrl)}
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
    </Modal>
  );
};

export default CreateEditModal;
