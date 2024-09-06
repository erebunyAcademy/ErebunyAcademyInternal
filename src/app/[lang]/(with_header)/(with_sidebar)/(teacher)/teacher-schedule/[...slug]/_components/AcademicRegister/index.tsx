'use client';
import React, { FC, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
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
import { ScheduleTypeEnum, ThematicPlanDescription } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { v4 } from 'uuid';
import { AcademicRegisterService } from '@/api/services/academic-register.service';
import { SelectLabel } from '@/components/atoms';
import Modal from '@/components/molecules/Modal';
import SimpleTable from '@/components/organisms/SimpleTable';
import { Locale } from '@/i18n';
import { markAttendantOptionData, periodListData } from '@/utils/constants/common';
import { ROUTE_TEACHER_SCHEDULE } from '@/utils/constants/routes';
import { languagePathHelper } from '@/utils/helpers/language';
import { GetScheduleByIdModel } from '@/utils/models/schedule';
import { CreateStudentAttentdanceRecordValidation } from '@/utils/validation/academic-register';

type AcademicRegisterProps = {
  schedule: NonNullable<GetScheduleByIdModel>;
  lang: Locale;
};

const resolver = classValidatorResolver(CreateStudentAttentdanceRecordValidation);

const AcademicRegister: FC<AcademicRegisterProps> = ({ schedule, lang }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedLessonOfTheDay = searchParams?.get('lessonOfTheDay');
  const [lessonOfTheDay, setLessonOfTheDay] = useState('');
  const t = useTranslations();

  const { data } = useQuery({
    queryFn: AcademicRegisterService.getTeacherAcademicRegisterLessonList.bind(null, schedule.id),
    queryKey: ['lesson-list'],
    initialData: {
      academicRegisterLesson: [],
    },
    enabled: !selectedLessonOfTheDay,
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isValid },
  } = useForm<CreateStudentAttentdanceRecordValidation>({
    resolver,
    defaultValues: {
      students: schedule.courseGroup.students.map(student => ({
        id: student.id,
        isPresent: student.attendanceRecord[0]?.isPresent || true,
        mark: student.attendanceRecord[0]?.mark ? student.attendanceRecord[0]?.mark.toString() : '',
      })),
      thematicPlanIds: [],
    },
  });

  const selectedPeriodData = periodListData.find(p => p.id === +(selectedLessonOfTheDay || 0));

  const { mutate: createStudentMark } = useMutation({
    mutationFn: (data: CreateStudentAttentdanceRecordValidation) =>
      AcademicRegisterService.createStudentMark(
        data,
        schedule.id,
        selectedLessonOfTheDay || lessonOfTheDay,
      ),
  });

  const { fields } = useFieldArray({
    control,
    name: 'students',
  });

  const { isOpen: chooseLessonModalOpen, onClose: closeChooseLessonModal } = useDisclosure({
    defaultIsOpen: !selectedLessonOfTheDay,
  });

  const {
    isOpen: endClassModalIsOpen,
    onClose: closeEndClassModal,
    onOpen: openEndClassModal,
  } = useDisclosure();

  const thematicPlanIds = watch('thematicPlanIds');

  const handleCheckboxChange = (id: string) => {
    if (thematicPlanIds.includes(id)) {
      setValue(
        'thematicPlanIds',
        thematicPlanIds.filter(existingId => existingId !== id),
      );
    } else {
      setValue('thematicPlanIds', [...thematicPlanIds, id]);
    }
  };

  useEffect(() => {
    const selectedThematicPlans = schedule.thematicPlans
      .flatMap(plan => plan.thematicPlanDescription)
      .reduce((acc, cur) => {
        if (cur.isCompleted) {
          acc.push(cur.id);
        }
        return acc;
      }, [] as string[]);

    if (selectedThematicPlans.length) {
      setValue('thematicPlanIds', selectedThematicPlans);
    }
  }, [reset, schedule.thematicPlans, setValue]);

  useMemo(() => {
    if (schedule.courseGroup.students && selectedLessonOfTheDay) {
      setValue(
        'students',
        schedule.courseGroup.students.map(student => ({
          id: student.id,
          isPresent: student.attendanceRecord[0]?.isPresent ?? true,
          mark: student.attendanceRecord[0]?.mark
            ? student.attendanceRecord[0]?.mark.toString()
            : '',
        })),
      );
    }
  }, [schedule.courseGroup.students, selectedLessonOfTheDay, setValue]);

  const columnHelperStudents = createColumnHelper<ThematicPlanDescription>();

  const studentsColumns = [
    columnHelperStudents.accessor('id', {
      id: v4(),
      cell: info => (
        <Checkbox
          isChecked={thematicPlanIds.includes(info.getValue())}
          onChange={() => handleCheckboxChange(info.getValue())}
        />
      ),
      header: undefined,
    }),
    columnHelperStudents.accessor('title', {
      id: v4(),
      cell: info => info.getValue(),
      header: t('title'),
    }),
  ];

  const onSubmit = (data: CreateStudentAttentdanceRecordValidation) => {
    createStudentMark(data);
  };

  const endLessonSubmitHandler = (data: CreateStudentAttentdanceRecordValidation) => {
    createStudentMark(
      { ...data, isCompletedLesson: true },
      {
        onSuccess() {
          router.push(languagePathHelper(lang, ROUTE_TEACHER_SCHEDULE));
        },
      },
    );
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
                    {schedule.courseGroup.students[index].user.firstName}{' '}
                    {schedule.courseGroup.students[index].user.lastName}
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
                  <Td border="1px solid #eee" minWidth="230px">
                    <Controller
                      control={control}
                      name={`students.${index}.mark`}
                      render={({ field }) => (
                        <Flex alignItems="center">
                          <SelectLabel
                            isRequired
                            options={markAttendantOptionData}
                            valueLabel="id"
                            nameLabel="title"
                            onChange={e => {
                              field.onChange(e);
                              if (e.target.value) {
                                setValue(`students.${index}.isPresent`, true);
                              }
                            }}
                            value={field.value}
                            isDisabled={!selectedLessonOfTheDay || !isPresent}
                          />
                          <Button
                            ml={2}
                            size="sm"
                            colorScheme="gray"
                            onClick={() => setValue(`students.${index}.mark`, '')}
                            isDisabled={!field.value || field.value === ''}>
                            Cancel
                          </Button>
                        </Flex>
                      )}
                    />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>

      <Flex flexDirection="column" m={{ base: '30px 0 20px 0', sm: '60px 0 30px 0' }}>
        <Heading fontSize={{ base: '22px', sm: '26px' }}>{t('thematicPlans')}</Heading>
        {schedule.thematicPlans.map(thematicPlan => (
          <SimpleTable
            key={thematicPlan.id}
            columns={studentsColumns}
            title={thematicPlan.type}
            data={thematicPlan.thematicPlanDescription}
          />
        ))}
      </Flex>

      <Flex justifyContent="space-between" m="20px 0 20px 0" gap="15px">
        <Button isDisabled={!isValid} onClick={handleSubmit(onSubmit)}>
          {t('save')}
        </Button>
        <Button isDisabled={!isValid} onClick={openEndClassModal}>
          {t('endClass')}
        </Button>
      </Flex>

      <Modal
        isOpen={chooseLessonModalOpen}
        onClose={() => {
          closeChooseLessonModal();
          router.push(`${languagePathHelper(lang, `/teacher-schedule`)}`);
        }}
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
          options={
            schedule.type === ScheduleTypeEnum.NON_CYCLIC
              ? schedule.availableDays.map(availableDay => ({
                  id: availableDay.lessonOfTheDay,
                  title: `${availableDay.lessonOfTheDay} - ${availableDay.lessonOfTheDay + 1}`,
                }))
              : periodListData
          }
          disabledOptions={data?.academicRegisterLesson?.map(lesson => lesson.lessonOfTheDay)}
          labelName="period"
          valueLabel="id"
          nameLabel="title"
          onChange={e => setLessonOfTheDay(e.target.value)}
          value={lessonOfTheDay}
        />
      </Modal>

      <Modal
        isOpen={endClassModalIsOpen}
        onClose={closeEndClassModal}
        title="lesson"
        size="2xl"
        primaryAction={handleSubmit(endLessonSubmitHandler)}
        actionText="end"
        withoutCancelBtn
      />
    </Box>
  );
};

export default AcademicRegister;
