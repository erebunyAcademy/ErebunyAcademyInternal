'use client';
import React, { FC, useEffect } from 'react';
import { Button, Flex } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { CourseGroupService } from '@/api/services/course-group.service';
import { CourseService } from '@/api/services/courses.service';
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
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<SelectStudentCourseGroupValidation>({
    resolver,
    defaultValues: {
      courseGroupId: '',
      courseId: '',
    },
  });

  const courseId = watch('courseId');

  useEffect(() => {
    if (selectedStudent?.student?.courseGroup?.id) {
      reset({
        courseId: selectedStudent.student.course.id,
        courseGroupId: selectedStudent.student.courseGroup.id,
      });
    }
  }, [reset, selectedStudent]);

  const { data: courseQueryData } = useQuery({
    queryKey: ['course-group'],
    queryFn: CourseService.list.bind(null),
    initialData: [],
  });

  const { data: courseGroupData } = useQuery({
    queryKey: ['course-group', courseId],
    queryFn: () => CourseGroupService.getCourseGroupByCourseId(courseId),
    enabled: !!courseId,
    initialData: [],
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
          name="courseId"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <SelectLabel
              isRequired
              name={name}
              options={courseQueryData.map(course => ({
                id: course.id,
                title: `${course.title} (${course.faculty?.title})`,
              }))}
              labelName="course"
              valueLabel="id"
              nameLabel="title"
              onChange={e => {
                setValue('courseGroupId', '');
                onChange(e.target.value);
              }}
              value={value}
              isInvalid={!!errors.courseGroupId?.message}
              formErrorMessage={errors.courseGroupId?.message}
            />
          )}
        />
        <Controller
          name="courseGroupId"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <SelectLabel
              isRequired
              name={name}
              options={courseGroupData}
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
