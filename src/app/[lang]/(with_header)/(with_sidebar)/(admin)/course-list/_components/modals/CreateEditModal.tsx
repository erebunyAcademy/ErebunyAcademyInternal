'use client';
import React, { FC, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { CourseService } from '@/api/services/courses.service';
import { FacultyService } from '@/api/services/faculty.service';
import { FormInput, SelectLabel } from '@/components/atoms';
import Modal from '@/components/molecules/Modal';
import { CourseModel } from '@/utils/models/course';
import { FacultySignupListModel } from '@/utils/models/faculty';
import { CreateEditCourseValidation } from '@/utils/validation/courses';

type CreateEditModalProps = {
  isCreateEditModalOpen: boolean;
  closeCreateEditModal: () => void;
  selectedCourse: CourseModel | null;
  refetch: () => void;
  reset: () => void;
  isValid: boolean;
  handleSubmit: (
    onSubmit: (data: CreateEditCourseValidation) => void,
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors: FieldErrors<CreateEditCourseValidation>;
  control: Control<CreateEditCourseValidation>;
};

const CreateEditModal: FC<CreateEditModalProps> = ({
  isCreateEditModalOpen,
  closeCreateEditModal,
  selectedCourse,
  refetch,
  reset,
  control,
  isValid,
  handleSubmit,
  errors,
}) => {
  const t = useTranslations();

  const { data: facultyQueryData } = useQuery<FacultySignupListModel>({
    queryKey: ['faculty'],
    queryFn: FacultyService.list,
    enabled: isCreateEditModalOpen,
  });

  const { mutate: createCourse } = useMutation({
    mutationFn: CourseService.createCourse,
    onSuccess() {
      refetch();
      reset();
      closeCreateEditModal();
    },
  });

  const { mutate: updateCourse } = useMutation({
    mutationFn: CourseService.updateCourse,
    onSuccess() {
      refetch();
      reset();
      closeCreateEditModal();
    },
  });

  const onSubmitHandler = useCallback(
    (data: CreateEditCourseValidation) => {
      if (selectedCourse) {
        updateCourse({ data, id: selectedCourse.id });
      } else {
        createCourse(data);
      }
    },
    [createCourse, selectedCourse, updateCourse],
  );

  return (
    <Modal
      isOpen={isCreateEditModalOpen}
      onClose={closeCreateEditModal}
      title="course"
      primaryAction={handleSubmit(onSubmitHandler)}
      isDisabled={!isValid}
      actionText={selectedCourse ? 'edit' : 'create'}>
      <Controller
        name="title"
        control={control}
        render={({ field: { onChange, value, name } }) => (
          <FormInput
            isRequired
            name={name}
            type="text"
            formLabelName={t('courseTitle')}
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
            formLabelName={t('courseDescription')}
            value={value}
            placeholder="enterDescription"
            handleInputChange={onChange}
            isInvalid={!!errors.description?.message}
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
            labelName="faculty"
            valueLabel="id"
            nameLabel="title"
            onChange={onChange}
            value={value}
            isInvalid={!!errors.facultyId?.message}
            formErrorMessage={errors.facultyId?.message}
          />
        )}
      />
    </Modal>
  );
};

export default CreateEditModal;
