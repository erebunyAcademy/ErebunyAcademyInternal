'use client';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { AcademicRegisterService } from '@/api/services/academic-register.service';
import Calendar from '@/components/atoms/Calendar';
import { periodListData } from '@/utils/constants/common';
import { GetStudentAcademicRegisterModel } from '@/utils/models/academic-register';

type AcademicRegisterProps = {};

const AcademicRegister: FC<AcademicRegisterProps> = () => {
  const [registerData, setRegisterData] = useState<GetStudentAcademicRegisterModel>([]);
  const t = useTranslations();

  const { mutate } = useMutation({
    mutationFn: AcademicRegisterService.getAcademicRegisterData,
    onSuccess(res) {
      setRegisterData(res);
    },
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

  return (
    <Box width="100%">
      <Box maxWidth="400px" mt="100px">
        <Calendar selectDateHandler={dateChangeHandler} />
      </Box>
      <Table variant="simple" width="100%" mt="50px">
        <Thead>
          <Tr>
            <Th>{t('lessonDay')}</Th>
            <Th>{t('lessonOfTheDay')}</Th>
            <Th>{t('subject')}</Th>
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
                  <Td>
                    {periodListData.find(period => period.id === lesson.lessonOfTheDay)?.title}
                  </Td>
                  <Td>{lesson.academicRegister.schedule.subject.title}</Td>
                  <Td>{lesson.attendanceRecord[0]?.isPresent ? t('present') : t('absent')}</Td>
                  <Td>
                    {lesson.attendanceRecord.length > 0 && lesson.attendanceRecord[0].mark !== null
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
  );
};

export default AcademicRegister;
