'use client';
import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { AcademicRegisterService } from '@/api/services/academic-register.service';
import Calendar from '@/components/atoms/Calendar';
import Modal from '@/components/molecules/Modal';
import { periodListData } from '@/utils/constants/common';
import { ThematicPlanDataModel } from '@/utils/models/academic-register';
import { Maybe } from '@/utils/models/common';

type AcademicRegisterProps = {};

const AcademicRegister: FC<AcademicRegisterProps> = () => {
  const t = useTranslations();
  const [selectedSchedule, setSelectedSchedule] = useState<Maybe<ThematicPlanDataModel[]>>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { mutate, data: registerData = [] } = useMutation({
    mutationFn: AcademicRegisterService.getAcademicRegisterData,
  });

  useEffect(() => {
    mutate(null);
  }, [mutate]);

  const dateChangeHandler = useCallback(
    (startDate: Date, endDate: Date) => {
      mutate({ startDate, endDate });
    },
    [mutate],
  );

  const practicalThematicPlan =
    selectedSchedule && selectedSchedule.find(thematicPlan => thematicPlan.type === 'PRACTICAL');

  const thereoticalThematicPlan =
    selectedSchedule && selectedSchedule.find(thematicPlan => thematicPlan.type === 'THEORETICAL');

  return (
    <>
      <Box width="100%">
        <Box maxWidth="400px" mt="100px" ml="20px">
          <Calendar selectDateHandler={dateChangeHandler} />
        </Box>
        <Box maxWidth={{ base: '340px', sm: '670px', lg: '700px', xl: '100%' }} overflow="auto">
          <Table variant="simple" mt="50px">
            <Thead>
              <Tr>
                <Th>{t('lessonDay')}</Th>
                <Th>{t('subject')}</Th>
                <Th>{t('thematicPlans')}</Th>
                <Th>{t('lessonOfTheDay')}</Th>
                <Th>{t('attendanceStatus')}</Th>
                <Th>{t('marks')}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {registerData.map(day => (
                <React.Fragment key={day.id}>
                  {day.academicRegisterLessons.map((lesson, lessonIndex) => (
                    <Tr key={lesson.id}>
                      {lessonIndex === 0 && (
                        <Td rowSpan={day.academicRegisterLessons.length}>
                          {dayjs(day.createdAt).format('DD/MM/YYYY')}
                        </Td>
                      )}
                      <Td>{lesson.academicRegister.schedule.subject.title}</Td>

                      <Td>
                        <Button
                          variant="link"
                          onClick={() => {
                            setSelectedSchedule(
                              lesson.academicRegister.schedule.thematicPlans as any,
                            );
                            onOpen();
                          }}>
                          {t('seeThematicPlans')}
                        </Button>
                      </Td>

                      <Td>
                        {periodListData.find(period => period.id === lesson.lessonOfTheDay)?.title}
                      </Td>
                      <Td>{lesson.attendanceRecord[0]?.isPresent ? t('present') : t('absent')}</Td>
                      <Td>
                        {lesson.attendanceRecord.length > 0 &&
                        lesson.attendanceRecord[0].mark !== null
                          ? lesson.attendanceRecord[0].mark
                          : t('noMark')}
                      </Td>
                    </Tr>
                  ))}
                </React.Fragment>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Text fontSize="18px" fontWeight={600}>
          {t('PRACTICAL')}
        </Text>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>{t('isCompleted')}</Th>
              <Th>{t('title')}</Th>
              <Th>{t('hours')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {practicalThematicPlan &&
              practicalThematicPlan.thematicPlanDescriptions.map(plan => (
                <Tr key={plan.id}>
                  <Td>{plan.isCompleted ? t('yes') : t('no')}</Td>
                  <Td>{plan.title}</Td>
                  <Td>{plan.hour}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>

        <Text fontSize="18px" fontWeight={600}>
          {t('THEORETICAL')}
        </Text>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>{t('isCompleted')}</Th>
              <Th>{t('title')}</Th>
              <Th>{t('hours')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {thereoticalThematicPlan &&
              thereoticalThematicPlan.thematicPlanDescriptions.map(plan => (
                <Tr key={plan.id}>
                  <Td>{plan.isCompleted ? t('yes') : t('no')}</Td>
                  <Td>{plan.title}</Td>
                  <Td>{plan.hour}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Modal>
    </>
  );
};

export default AcademicRegister;
