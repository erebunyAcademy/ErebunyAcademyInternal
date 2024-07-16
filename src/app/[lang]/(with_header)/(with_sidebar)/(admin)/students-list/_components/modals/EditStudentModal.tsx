'use client';
import React, { FC } from 'react';
import { Button, Flex } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { CourseGroupService } from '@/api/services/course-group.service';
import { StudentService } from '@/api/services/student.service';
import { SelectLabel } from '@/components/atoms';
import Modal from '@/components/molecules/Modal';
import { StudentModel } from '@/utils/models/student';
import { UpdateStudentValidation } from '@/utils/validation/student';

type EditStudentModalProps = {
  isStudentEditModalOpen: boolean;
  closeStudentEditModal: () => void;
  isValid: boolean;
  handleSubmit: (
    onSubmit: (data: UpdateStudentValidation) => void,
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors: FieldErrors<UpdateStudentValidation>;
  control: Control<UpdateStudentValidation>;
  refetch: () => void;
  selectedStudent: StudentModel | null;
};

const EditStudentModal: FC<EditStudentModalProps> = ({
  isStudentEditModalOpen,
  closeStudentEditModal,
  control,
  errors,
  isValid,
  handleSubmit,
  refetch,
  selectedStudent,
}) => {
  const t = useTranslations();

  const { data: courseGroupData } = useQuery({
    queryFn: CourseGroupService.list.bind(null),
    queryKey: [''],
  });

  const { mutate: updateStudentData } = useMutation({
    mutationFn: (data: UpdateStudentValidation) =>
      StudentService.updateStudentData(data, selectedStudent?.student?.id!),
    onSuccess() {
      refetch();
      closeStudentEditModal();
    },
  });

  const updateStudentSubmitHandler = (data: UpdateStudentValidation) => {
    updateStudentData(data);
  };

  return (
    <Modal isOpen={isStudentEditModalOpen} onClose={closeStudentEditModal} title="editStudent">
      <Flex
        width={{ base: '100%' }}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap="50px">
        <Controller
          name="courseGroupId"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <SelectLabel
              isRequired
              name={name}
              options={courseGroupData || []}
              labelName="studentCourseGroup"
              valueLabel="id"
              nameLabel="title"
              onChange={onChange}
              value={value}
              isInvalid={!!errors.courseGroupId?.message}
              formErrorMessage={errors.courseGroupId?.message}
            />
          )}
        />
        <Button
          onClick={handleSubmit(updateStudentSubmitHandler)}
          isDisabled={!isValid}
          width="100%">
          {t('update')}
        </Button>
      </Flex>
    </Modal>
  );
};

export default EditStudentModal;
