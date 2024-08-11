'use client';
import React, { FC } from 'react';
import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { periodListData } from '@/utils/constants/common';
import { GetStudentAcademicRegisterModel } from '@/utils/models/academic-register';

type AcademicRegisterProps = {
  academicRegisterData: GetStudentAcademicRegisterModel;
};

const AcademicRegister: FC<AcademicRegisterProps> = ({ academicRegisterData }) => {
  return (
    <Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Subject</Th>
            <Th>Lesson</Th>
            <Th>Lesson of the day</Th>
            <Th>Attendance Status</Th>
            <Th>Mark</Th>
          </Tr>
        </Thead>
        <Tbody>
          {academicRegisterData.map(register => (
            <React.Fragment key={register.id}>
              {register.academicRegister?.academicRegisterDay.map((day, dayIndex) => (
                <React.Fragment key={day.id}>
                  {day.academicRegisterLessons.map((lesson, lessonIndex) => (
                    <Tr key={lesson.id}>
                      {dayIndex === 0 && lessonIndex === 0 && (
                        <Td
                          rowSpan={register.academicRegister?.academicRegisterDay.reduce(
                            (total, currentDay) =>
                              total + currentDay.academicRegisterLessons.length,
                            0,
                          )}>
                          {register.title}
                        </Td>
                      )}
                      {lessonIndex === 0 && (
                        <Td rowSpan={day.academicRegisterLessons.length}>
                          {day.createdAt.toLocaleDateString()}
                        </Td>
                      )}
                      <Td>
                        {periodListData.find(period => period.id === lesson.lessonOfTheDay)?.title}
                      </Td>
                      <Td>
                        {lesson.attendanceRecord.length > 0
                          ? lesson.attendanceRecord[0].isPresent
                            ? 'Present'
                            : 'Absent'
                          : 'No Record'}
                      </Td>
                      <Td>
                        {lesson.attendanceRecord.length > 0 &&
                        lesson.attendanceRecord[0].mark !== null
                          ? lesson.attendanceRecord[0].mark
                          : 'No Mark'}
                      </Td>
                    </Tr>
                  ))}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default AcademicRegister;
