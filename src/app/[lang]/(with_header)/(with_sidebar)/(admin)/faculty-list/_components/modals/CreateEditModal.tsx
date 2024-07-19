'use client';
import React, { FC, useCallback, useEffect } from 'react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { FacultyService } from '@/api/services/faculty.service';
import { FormInput } from '@/components/atoms';
import Modal from '@/components/molecules/Modal';
import { FacultyModel } from '@/utils/models/faculty';
import { CreateEditFacultyValidation } from '@/utils/validation/faculty';

type createEditModalProps = {
  selectedFaculty: FacultyModel | null;
  isCreateEditModalOpen: boolean;
  closeCreateEditModal: () => void;
  refetch: () => void;
};
const resolver = classValidatorResolver(CreateEditFacultyValidation);

const CreateEditModal: FC<createEditModalProps> = ({
  selectedFaculty,
  closeCreateEditModal,
  isCreateEditModalOpen,
  refetch,
}) => {
  const t = useTranslations();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateEditFacultyValidation>({
    resolver,
    defaultValues: {
      title: '',
      description: '',
    },
  });

  useEffect(() => {
    if (selectedFaculty) {
      reset({
        title: selectedFaculty.title || '',
        description: selectedFaculty.description || '',
      });
    }
  }, [selectedFaculty, reset]);
  

  const { mutate: createFaculty } = useMutation({
    mutationFn: FacultyService.createFaculty,
    onSuccess() {
      refetch();
      reset();
      closeCreateEditModal();
    },
  });

  const { mutate: updateFaculty } = useMutation({
    mutationFn: FacultyService.updateFaculty,
    onSuccess() {
      refetch();
      reset();
      closeCreateEditModal();
    },
  });

  const onSubmitHandler = useCallback(
    (data: CreateEditFacultyValidation) => {
      if (selectedFaculty) {
        updateFaculty({ data, id: selectedFaculty.id });
      } else {
        createFaculty(data);
      }
    },
    [createFaculty, selectedFaculty, updateFaculty],
  );

  return (
    <Modal
      isOpen={isCreateEditModalOpen}
      onClose={closeCreateEditModal}
      title="faculty"
      primaryAction={handleSubmit(onSubmitHandler)}
      isDisabled={!isValid}
      actionText={selectedFaculty ? 'edit' : 'create'}>
      <Controller
        name="title"
        control={control}
        render={({ field: { onChange, value, name } }) => (
          <FormInput
            isRequired
            name={name}
            type="text"
            formLabelName={t('facultyName')}
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
            formLabelName={t('facultyDescription')}
            value={value}
            placeholder="enterDescription"
            handleInputChange={onChange}
            isInvalid={!!errors.description?.message}
            formErrorMessage={errors.description?.message}
          />
        )}
      />
    </Modal>
  );
};

export default CreateEditModal;
