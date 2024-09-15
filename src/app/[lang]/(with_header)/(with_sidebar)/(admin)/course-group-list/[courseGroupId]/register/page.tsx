'use client';
import React, { Fragment, useEffect, useState } from 'react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { AcademicRegisterService } from '@/api/services/academic-register.service';
import { SelectLabel } from '@/components/atoms';
import Calendar from '@/components/atoms/Calendar';
import { markAttendantOptionData } from '@/utils/constants/common';
import { periodListData } from '@/utils/constants/common';
import { UpdateStudentAttendanceRecordsValidation } from '@/utils/validation/academic-register';

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

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isDirty },
  } = useForm<UpdateStudentAttendanceRecordsValidation>({
    defaultValues: {
      attendantRecords: [],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: 'attendantRecords',
  });

  const { mutate: updateStudentAttendantRecord } = useMutation({
    mutationFn: AcademicRegisterService.updateAttendantRecords,
  });

  const onSubmit = (data: UpdateStudentAttendanceRecordsValidation) => {
    console.log(data);
    updateStudentAttendantRecord(data);
  };

  return (
    <Flex flexDirection="column">
      <Text as="h2" fontWeight={800} textAlign="center">
        Journal
      </Text>
      <Box maxWidth="400px" mt="100px" ml="20px">
        <Calendar selectDateHandler={(startDate, endDate) => mutate({ startDate, endDate })} />
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
                    <Td>
                      Lesson{' '}
                      {periodListData.find(period => period.id === lesson.lessonOfTheDay)?.title ||
                        lesson.lessonOfTheDay}
                    </Td>
                    <Td>
                      <IconButton
                        aria-label="Expand lesson"
                        icon={expandedLesson === lesson.id ? <MinusIcon /> : <AddIcon />}
                        onClick={() => {
                          toggleExpand(lesson.id);
                          reset({
                            attendantRecords: lesson.attendanceRecord.map(record => ({
                              id: record.id,
                              attendantId: record.id,
                              mark: record.mark ? record.mark.toString() : undefined,
                              isPresent: record.isPresent,
                            })),
                          });
                        }}
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
                                <Th>Actions</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {fields.map((field, index) => {
                                const isPresent = watch(`attendantRecords.${index}.isPresent`);

                                return (
                                  <Tr key={field.id}>
                                    <Td>
                                      {lesson.attendanceRecord[index].student.user.firstName}{' '}
                                      {lesson.attendanceRecord[index].student.user.lastName}
                                    </Td>
                                    <Td>
                                      <Controller
                                        control={control}
                                        name={`attendantRecords.${index}.mark`}
                                        render={({ field }) => (
                                          <SelectLabel
                                            isRequired
                                            options={markAttendantOptionData}
                                            valueLabel="id"
                                            nameLabel="title"
                                            onChange={e => {
                                              field.onChange(e);
                                              if (e.target.value) {
                                                setValue(
                                                  `attendantRecords.${index}.isPresent`,
                                                  true,
                                                );
                                              }
                                            }}
                                            value={field.value || ''}
                                            isDisabled={!isPresent}
                                          />
                                        )}
                                      />
                                    </Td>
                                    <Td>
                                      <Controller
                                        control={control}
                                        name={`attendantRecords.${index}.isPresent`}
                                        render={({ field }) => (
                                          <Checkbox
                                            isChecked={field.value}
                                            onChange={e => {
                                              field.onChange(e);
                                              if (!e.target.checked) {
                                                setValue(
                                                  `attendantRecords.${index}.mark`,
                                                  undefined,
                                                );
                                              }
                                            }}
                                          />
                                        )}
                                      />
                                    </Td>
                                    <Td>
                                      <Button
                                        size="sm"
                                        colorScheme="gray"
                                        onClick={() =>
                                          setValue(`attendantRecords.${index}.mark`, undefined)
                                        }
                                        isDisabled={!watch(`attendantRecords.${index}.mark`)}>
                                        Cancel
                                      </Button>
                                    </Td>
                                  </Tr>
                                );
                              })}
                            </Tbody>
                          </Table>
                        </Box>
                      </Td>
                    </Tr>
                  )}
                  {expandedLesson === lesson.id && (
                    <Tr>
                      <Flex justifyContent="space-between" m="20px 0">
                        <Button colorScheme="red" isDisabled={!isDirty}>
                          Cancel
                        </Button>
                        <Button onClick={handleSubmit(onSubmit)} isDisabled={!isDirty}>
                          Save
                        </Button>
                      </Flex>
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

export default CourseGroupRegister;
