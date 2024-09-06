'use client';
import React, { FC, useCallback, useEffect } from 'react';
import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { AcademicRegisterService } from '@/api/services/academic-register.service';
import Calendar from '@/components/atoms/Calendar';
import { periodListData } from '@/utils/constants/common';

type AcademicRegisterProps = {};

const AcademicRegister: FC<AcademicRegisterProps> = () => {
  const t = useTranslations();

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

  console.log({ registerData });

  return (
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
                    {/* THEMATIC PLAN MODAL SHOULD OPEN AFTER CLICKING THIS */}
                    <Td>{lesson.academicRegister.schedule.thematicPlans[0].type}</Td>
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
  );
};

export default AcademicRegister;
