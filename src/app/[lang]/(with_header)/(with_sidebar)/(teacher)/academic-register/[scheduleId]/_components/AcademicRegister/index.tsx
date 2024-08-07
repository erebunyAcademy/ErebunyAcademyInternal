'use client';
import React, { FC, useLayoutEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { AcademicRegisterService } from '@/api/services/academic-register.service';
import { SelectLabel } from '@/components/atoms';
import Modal from '@/components/molecules/Modal';
import { markAttentandOptionData, periodListData } from '@/utils/constants/common';
import { GetAcademicRegisterType, GetScheduleByIdType } from '@/utils/models/academic-register';
import { Maybe } from '@/utils/models/common';
import { UserStudentModel } from '@/utils/models/student';
import { CreateStudentAttentdanceRecordValidation } from '@/utils/validation/academic-register';

type AcademicRegisterProps = {
  students: UserStudentModel;
  academicRegister: GetAcademicRegisterType;
  schedule: GetScheduleByIdType;
  lessonOfTheDay: Maybe<string>;
};

const resolver = classValidatorResolver(CreateStudentAttentdanceRecordValidation);

const AcademicRegister: FC<AcademicRegisterProps> = ({
  students,
  lessonOfTheDay: dayLesson,
  academicRegister,
  schedule,
}) => {
  const router = useRouter();
  const [lessonOfTheDay, setLessonOfTheDay] = useState(dayLesson || '');
  const t = useTranslations();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateStudentAttentdanceRecordValidation>({
    resolver,
    defaultValues: {
      students: students.map(student => ({
        id: student.id,
        isPresent: true,
        mark: '',
      })),
    },
  });

  console.log({ errors });

  const selectedPeriodData = periodListData.find(p => p.id === lessonOfTheDay);

  const { mutate: createStudentMark } = useMutation({
    mutationFn: (data: CreateStudentAttentdanceRecordValidation) =>
      AcademicRegisterService.createStudentMark(
        data,
        schedule.courseGroupId,
        lessonOfTheDay,
        academicRegister?.id,
      ),
  });

  const { fields } = useFieldArray({
    control,
    name: 'students',
  });

  useMemo(() => {
    if (academicRegister) {
      reset({
        students: academicRegister.attendanceRecords.map(attendant => ({
          id: attendant.studentId,
          isPresent: !attendant.isAbsent,
          mark: attendant.mark ? attendant.mark.toString() : '',
        })),
      });
      setLessonOfTheDay(academicRegister.attendanceRecords[0]?.lessonOfTheDay || '');
    }
  }, [academicRegister, reset]);

  const {
    isOpen: chooseLessonModalOpen,
    onClose: closeChooseLessonModal,
    onOpen,
  } = useDisclosure();

  useLayoutEffect(() => {
    if (!lessonOfTheDay && !academicRegister?.attendanceRecords[0]?.lessonOfTheDay) {
      onOpen();
    }
  }, [academicRegister?.attendanceRecords, lessonOfTheDay, onOpen]);

  const onSubmit = (data: CreateStudentAttentdanceRecordValidation) => {
    createStudentMark(data);
  };

  return (
    <Box width="100%" mt="50px" mx="20px">
      <Text fontSize={{ base: '18px', sm: '24px' }} fontWeight={700} mb="15px">
        {t('forLessonTitleStart')}{' '}
        <Text as="span" color="#319795">
          {selectedPeriodData?.title}
        </Text>{' '}
        {t('forLessonTitleEnd')}
      </Text>
      <Box overflowY="auto" maxWidth={{ base: '340px', sm: '670px', lg: '700px', xl: '100%' }}>
        <Table>
          <Thead>
            <Tr>
              <Th>{t('student')}</Th>
              <Th>{t('presentTitle')}</Th>
              <Th>{t('marks')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {fields.map((field, index) => {
              const isPresent = watch(`students.${index}.isPresent`);
              return (
                <Tr key={field.id} height="32px">
                  <Td minWidth="200px">
                    {students[index].user.firstName} {students[index].user.lastName}
                  </Td>
                  <Td border="1px solid #eee" minWidth="200px">
                    <Controller
                      control={control}
                      name={`students.${index}.isPresent`}
                      render={({ field }) => (
                        <Checkbox
                          isChecked={field.value}
                          onChange={e => {
                            field.onChange(e);
                            if (!e.target.checked) {
                              setValue(`students.${index}.mark`, '');
                            }
                          }}
                          defaultChecked>
                          {t('present')}
                        </Checkbox>
                      )}
                    />
                  </Td>
                  <Td border="1px solid #eee" minWidth="200px">
                    <Controller
                      control={control}
                      name={`students.${index}.mark`}
                      render={({ field }) => (
                        <SelectLabel
                          isRequired
                          options={markAttentandOptionData}
                          valueLabel="id"
                          nameLabel="title"
                          onChange={e => {
                            field.onChange(e);
                            if (e.target.value) {
                              setValue(`students.${index}.isPresent`, true);
                            }
                          }}
                          value={field.value}
                          isDisabled={!lessonOfTheDay || !isPresent}
                        />
                      )}
                    />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
      <Flex justifyContent="space-between" mt="20px">
        <Button onClick={handleSubmit(onSubmit)}>{t('endClass')}</Button>
      </Flex>
      <Modal
        isOpen={chooseLessonModalOpen}
        onClose={closeChooseLessonModal}
        isDisabled={!lessonOfTheDay}
        title="lesson"
        size="4xl"
        primaryAction={() => {
          router.push(`?lessonOfTheDay=${lessonOfTheDay}`);
          closeChooseLessonModal();
        }}
        actionText="start"
        withoutCancelBtn>
        <SelectLabel
          isRequired
          options={periodListData}
          labelName="period"
          valueLabel="id"
          nameLabel="title"
          onChange={e => setLessonOfTheDay(e.target.value)}
          value={lessonOfTheDay}
        />
      </Modal>
    </Box>
  );
};

export default AcademicRegister;
