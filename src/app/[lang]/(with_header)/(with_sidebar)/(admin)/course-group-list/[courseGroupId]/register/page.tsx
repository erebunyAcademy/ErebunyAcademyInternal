'use client';
import React, { Fragment, memo, useCallback, useEffect, useState } from 'react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { AcademicRegisterService } from '@/api/services/academic-register.service';
import Calendar from '@/components/atoms/Calendar';

const CourseGroupRegister = ({
  params: { courseGroupId },
}: {
  params: { courseGroupId: string };
}) => {
  const [expandedLesson, setExpandedLesson] = useState<null | string>(null);

  const { data = [], mutate } = useMutation({
    mutationFn: AcademicRegisterService.getCourseGroupAcademicRegister.bind(null, courseGroupId),
  });

  const toggleExpand = (lessonId: string) => {
    setExpandedLesson(prev => (prev === lessonId ? null : lessonId));
  };

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
    <Flex flexDirection="column">
      <Text as="h2" fontWeight={800} textAlign="center">
        Journal
      </Text>
      <Box maxWidth="400px" mt="100px" ml="20px">
        <Calendar selectDateHandler={dateChangeHandler} />
      </Box>
      <Table>
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Lesson</Th>
            <Th>Expand</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map(academicRegisterDay => (
            <Fragment key={academicRegisterDay.id}>
              {academicRegisterDay.academicRegisterLessons.map((lesson, lessonIndex) => (
                <Fragment key={lesson.id}>
                  <Tr>
                    {lessonIndex === 0 && (
                      <Td rowSpan={academicRegisterDay.academicRegisterLessons.length}>
                        {dayjs(academicRegisterDay.createdAt).format('DD/MM/YYYY')}
                      </Td>
                    )}
                    <Td>Lesson {lesson.lessonOfTheDay}</Td>
                    <Td>
                      <IconButton
                        aria-label="Expand lesson"
                        icon={expandedLesson === lesson.id ? <MinusIcon /> : <AddIcon />}
                        onClick={() => toggleExpand(lesson.id)}
                      />
                    </Td>
                  </Tr>

                  {expandedLesson === lesson.id && (
                    <Tr>
                      <Td colSpan={3}>
                        <Box border="1px solid gray" padding={4}>
                          <Table size="sm">
                            <Thead>
                              <Tr>
                                <Th>Student</Th>
                                <Th>Mark</Th>
                                <Th>Attendance</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {lesson.attendanceRecord.map(attendance => (
                                <Tr key={attendance.id}>
                                  <Td>
                                    {attendance.student.user.firstName}{' '}
                                    {attendance.student.user.lastName}
                                  </Td>
                                  <Td>{attendance.mark ?? 'N/A'}</Td>
                                  <Td>
                                    {attendance.isPresent ? (
                                      <Text color="green.500">Present</Text>
                                    ) : (
                                      <Text color="red.500">Absent</Text>
                                    )}
                                  </Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </Box>
                      </Td>
                    </Tr>
                  )}
                </Fragment>
              ))}
            </Fragment>
          ))}
        </Tbody>
      </Table>
    </Flex>
  );
};

export default memo(CourseGroupRegister);
