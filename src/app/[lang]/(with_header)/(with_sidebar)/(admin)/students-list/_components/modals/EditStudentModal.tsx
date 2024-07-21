'use client';
import React, { FC, useEffect } from 'react';
import { Button, Flex } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { CourseGroupService } from '@/api/services/course-group.service';
import { StudentService } from '@/api/services/student.service';
import { SelectLabel } from '@/components/atoms';
import Modal from '@/components/molecules/Modal';
import { StudentModel } from '@/utils/models/student';
import { SelectStudentCourseGroupValidation } from '@/utils/validation/courseGroup';
import { UpdateStudentValidation } from '@/utils/validation/student';

const resolver = classValidatorResolver(SelectStudentCourseGroupValidation);

type EditStudentModalProps = {
  isStudentEditModalOpen: boolean;
  closeStudentEditModal: () => void;
  refetch: () => void;
  selectedStudent: StudentModel | null;
};

const EditStudentModal: FC<EditStudentModalProps> = ({
  isStudentEditModalOpen,
  closeStudentEditModal,
  refetch,
  selectedStudent,
}) => {
  const t = useTranslations();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<SelectStudentCourseGroupValidation>({
    resolver,
    defaultValues: {
      courseGroupId: '',
    },
  });

  useEffect(() => {
    if (selectedStudent?.student?.courseGroup?.id) {
      reset({
        courseGroupId: selectedStudent.student?.courseGroup?.id,
      });
    }
  }, [reset, selectedStudent]);

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
