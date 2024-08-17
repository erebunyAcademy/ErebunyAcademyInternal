'use client';
import React, { ChangeEvent, FC, useCallback, useMemo, useState } from 'react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, Button, Divider, Flex, IconButton, Input, Stack, Text } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { ScheduleTypeEnum } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { CourseGroupService } from '@/api/services/course-group.service';
import { ScheduleService } from '@/api/services/schedule.service';
import { SubjectService } from '@/api/services/subject.service';
import { TeacherService } from '@/api/services/teacher.service';
import { UploadService } from '@/api/services/upload.service';
import { FormInput, SelectLabel } from '@/components/atoms';
import Modal from '@/components/molecules/Modal';
import { academicYearListData, scheduleExamType } from '@/utils/constants/common';
import { Maybe } from '@/utils/models/common';
import { GetCourseGroupsBySubjectId } from '@/utils/models/courseGroup';
import { ScheduleSingleModel } from '@/utils/models/schedule';
import { TeacherDataModel } from '@/utils/models/teachers';
import { AttachmentValidation } from '@/utils/validation';
import { CreateEditScheduleValidation } from '@/utils/validation/schedule';

type CreateEditModalProps = {
  isModalOpen: boolean;
  closeModal: () => void;
  selectedSchedule: Maybe<ScheduleSingleModel>;
  refetch: () => void;
};

const resolver = classValidatorResolver(CreateEditScheduleValidation);

type FileWithLocalUrl = {
  file: File;
  localUrl: string;
};

const CreateEditModal: FC<CreateEditModalProps> = ({
  isModalOpen,
  closeModal,
  selectedSchedule,
  refetch,
}) => {
  const t = useTranslations();
  const [files, setFiles] = useState<Maybe<FileWithLocalUrl[]>>(null);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
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
      examType: 'ASSESSMENT',
      teacherId: '',
      courseGroupId: '',
      attachments: [],
      links: [],
      academicYear: '',
    },
  });

  useMemo(() => {
    if (selectedSchedule) {
      const attachmentWithUrls = selectedSchedule.attachment.map(attachment => ({
        key: attachment.key,
        mimetype: attachment.mimetype,
        title: attachment.title || '',
        localUrl: attachment.key, // Assuming your files are served from the `/uploads` directory
      }));

      setFiles(
        attachmentWithUrls.map(att => ({
          file: new File([], att.title),
          localUrl: att.localUrl,
        })),
      );

      reset({
        totalHours: selectedSchedule.totalHours.toString(),
        subjectId: selectedSchedule.subjectId,
        title: selectedSchedule.title,
        description: selectedSchedule.description || '',
        startDayDate: dayjs(selectedSchedule.startDayDate).format('YYYY-MM-DD'),
        examDate: dayjs(selectedSchedule.examDate).format('YYYY-MM-DD'),
        endDayDate: dayjs(selectedSchedule.endDayDate).format('YYYY-MM-DD'),
        teacherId: selectedSchedule.scheduleTeachers[0].teacherId,
        courseGroupId: selectedSchedule.courseGroupId,
        examType: selectedSchedule.examType,
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

  const { data: teachersQueryData } = useQuery<TeacherDataModel>({
    queryKey: ['teachers'],
    queryFn: TeacherService.getTeachers,
    enabled: isModalOpen,
  });

  const { mutate: createEditSchedule } = useMutation({
    mutationFn: (data: CreateEditScheduleValidation) =>
      ScheduleService[selectedSchedule ? 'updateSchedule' : 'createSchedule'](
        data,
        ScheduleTypeEnum.CYCLIC,
      ),
    mutationKey: ['create-schedule'],
    onSuccess() {
      reset();
      closeModal();
      refetch();
    },
  });

  const subjectId = watch('subjectId');

  const { data: courseGroupQueryData } = useQuery<GetCourseGroupsBySubjectId>({
    queryKey: ['course-group'],
    queryFn: () => CourseGroupService.getCourseGroupsBySubjectId(subjectId),
    enabled: !!subjectId,
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
      (teachersQueryData || [])?.map(teacher => ({
        id: teacher.teacher?.id,
        title: `${teacher.firstName} ${teacher.lastName}`,
      })),
    [teachersQueryData],
  );

  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({
    control,
    name: 'links',
  });

  const onFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles?.length) {
      const fileArray = Array.from(selectedFiles).map(file => {
        const localUrl = URL.createObjectURL(file);
        return { file, localUrl };
      });
      setFiles(prevState => {
        if (prevState?.length) {
          return [...prevState, ...fileArray];
        }
        return fileArray;
      });
    }
  };

  const { mutate: uploadAttachment } = useMutation({
    mutationFn: (data: { file: FormData; key: string }) => UploadService.uploadFile(data),
  });

  const onSubmitHandler = useCallback(
    (data: CreateEditScheduleValidation) => {
      const attachmentKeys: AttachmentValidation[] = [];

      files?.forEach(({ file }) => {
        if (!file) {
          return;
        }

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

        uploadAttachment({
          file: formData,
          key,
        });
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
    [createEditSchedule, files, selectedSchedule, uploadAttachment],
  );

  const removeFile = (localUrl: string) => {
    setFiles(prevFiles => prevFiles?.filter(file => file.localUrl !== localUrl) || null);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      isDisabled={!isValid}
      title="cyclicSchedule"
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
        <Controller
          name="startDayDate"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <FormInput
              isRequired
              name={name}
              type="date"
              formLabelName={t('startDay')}
              value={value}
              handleInputChange={onChange}
              isInvalid={!!errors[name]?.message}
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
              type="date"
              formLabelName={t('endDay')}
              value={value}
              handleInputChange={onChange}
              isInvalid={!!errors[name]?.message}
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
              formLabelName={t('examDay')}
              value={value}
              handleInputChange={onChange}
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
              {t('uploadDocument')}
            </Button>
          </Box>
        </Flex>
      </Flex>
    </Modal>
  );
};

export default CreateEditModal;
