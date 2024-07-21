'use client';
import React, { FC, useCallback, useEffect } from 'react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { CourseGroupService } from '@/api/services/course-group.service';
import { CourseService } from '@/api/services/courses.service';
import { FormInput, SelectLabel } from '@/components/atoms';
import Modal from '@/components/molecules/Modal';
import { GetCoursesListModel } from '@/utils/models/course';
import { CourseGroupSingleModel } from '@/utils/models/courseGroup';
import { CreateEditCourseGroupValidation } from '@/utils/validation/courseGroup';

const resolver = classValidatorResolver(CreateEditCourseGroupValidation);

type CreateEditModalProps = {
  selectedCourseGroup: CourseGroupSingleModel | null;
  isCreateEditModalOpen: boolean;
  closeCreateEditModal: () => void;
  refetch: () => void;
};

const CreateEditModal: FC<CreateEditModalProps> = ({
  selectedCourseGroup,
  isCreateEditModalOpen,
  closeCreateEditModal,
  refetch,
}) => {
  const t = useTranslations();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateEditCourseGroupValidation>({
    resolver,
    defaultValues: {
      title: '',
      description: '',
      courseId: '',
    },
  });

  useEffect(() => {
    if (selectedCourseGroup) {
      reset({
        title: selectedCourseGroup.title,
        description: selectedCourseGroup.description || '',
        courseId: selectedCourseGroup.course?.id,
      });
    }
  }, [selectedCourseGroup, reset]);

  const { data: courseQueryData } = useQuery<GetCoursesListModel>({
    queryKey: ['course'],
    queryFn: CourseService.list,
    enabled: isCreateEditModalOpen,
  });

  const { mutate: createCourseGroup } = useMutation({
    mutationFn: CourseGroupService.createCourseGroup,
    onSuccess() {
      refetch();
      reset();
      closeCreateEditModal();
    },
  });

  const { mutate: updateCourseGroup } = useMutation({
    mutationFn: CourseGroupService.updateCourseGroup,
    onSuccess() {
      refetch();
      reset();
      closeCreateEditModal();
    },
  });

  const onSubmitHandler = useCallback(
    (data: CreateEditCourseGroupValidation) => {
      if (selectedCourseGroup) {
        updateCourseGroup({ data, id: selectedCourseGroup.id });
      } else {
        createCourseGroup(data);
      }
    },
    [createCourseGroup, selectedCourseGroup, updateCourseGroup],
  );

  return (
    <Modal
      isOpen={isCreateEditModalOpen}
      onClose={closeCreateEditModal}
      title="courseGroup"
      primaryAction={handleSubmit(onSubmitHandler)}
      isDisabled={!isValid}
      actionText={selectedCourseGroup ? 'edit' : 'create'}>
      <Controller
        name="title"
        control={control}
        render={({ field: { onChange, value, name } }) => (
          <FormInput
            isRequired
            name={name}
            type="text"
            formLabelName={t('courseGroupName')}
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
            formLabelName={t('courseGroupDescription')}
            value={value}
            placeholder="enterDescription"
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
            labelName="course"
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
  );
};

export default CreateEditModal;
