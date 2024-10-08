'use client';
import React, { Fragment, useEffect, useState } from 'react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { AcademicRegisterService } from '@/api/services/academic-register.service';
import { SelectLabel } from '@/components/atoms';
import Calendar from '@/components/atoms/Calendar';
import { markAttendantOptionData, periodListData } from '@/utils/constants/common';
import { UpdateStudentAttendanceRecordsValidation } from '@/utils/validation/academic-register';

const CourseGroupRegister = ({
  params: { courseGroupId },
}: {
  params: { courseGroupId: string };
}) => {
  const [expandedLesson, setExpandedLesson] = useState<null | string>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const t = useTranslations();

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
    reset,
    watch,
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
    onSuccess() {
      mutate(null);
    },
  });

  const onSubmit = (data: UpdateStudentAttendanceRecordsValidation) => {
    updateStudentAttendantRecord(data);
    onClose();
  };

  const openEditModal = (lesson: any) => {
    setSelectedLesson(lesson);
    reset({
      attendantRecords: lesson.attendanceRecord.map((record: any) => ({
        id: record.id,
        attendantId: record.id,
        mark: record.mark ? record.mark.toString() : undefined,
        isPresent: record.isPresent,
      })),
    });
    onOpen();
  };

  return (
    <Flex flexDirection="column">
      <Text as="h2" fontWeight={800} textAlign="center" fontSize="24px">
        {t('academicRegister')}
      </Text>
      <Box maxWidth="400px" m="100px 0 30px 20px">
        <Calendar selectDateHandler={(startDate, endDate) => mutate({ startDate, endDate })} />
      </Box>
      <Table>
        <Thead>
          <Tr>
            <Th>{t('lessonDay')}</Th>
            <Th>{t('lesson')}</Th>
            <Th>{t('subject')}</Th>
            <Th>{t('lecturer')}</Th>
            <Th>{t('expand')}</Th>
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
                    <Td>{lesson.academicRegister.subject.title}</Td>
                    <Td>
                      {lesson.academicRegister.schedule.scheduleTeachers.map(({ teacher }) => (
                        <Text key={teacher.id}>
                          {teacher.user.firstName} {teacher.user.lastName}{' '}
                        </Text>
                      ))}
                    </Td>
                    <Td>
                      <IconButton
                        aria-label="Expand lesson"
                        icon={expandedLesson === lesson.id ? <MinusIcon /> : <AddIcon />}
                        onClick={() => {
                          toggleExpand(lesson.id);
                        }}
                      />
                    </Td>
                    <Td>
                      <Button onClick={() => openEditModal(lesson)}>{t('edit')}</Button>
                    </Td>
                  </Tr>

                  {expandedLesson === lesson.id && (
                    <Tr>
                      <Td colSpan={3}>
                        <Box border="1px solid gray" padding="15px">
                          <Table size="sm">
                            <Thead>
                              <Tr>
                                <Th>{t('student')}</Th>
                                <Th>{t('mark')}</Th>
                                <Th>{t('attendanceStatus')}</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {lesson.attendanceRecord.map(record => (
                                <Tr key={record.id}>
                                  <Td>
                                    {record.student.user.firstName} {record.student.user.lastName}
                                  </Td>
                                  <Td>{record.mark || '-'}</Td>
                                  <Td>{record.isPresent ? t('present') : t('absent')}</Td>
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

      <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered>
        <ModalOverlay />
        <ModalContent p="15px">
          <ModalHeader mb="10px">{t('editAttendanceRecords')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedLesson && (
              <Box>
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>{t('student')}</Th>
                      <Th>{t('mark')}</Th>
                      <Th>{t('attendanceStatus')}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {fields.map((field, index) => {
                      const isPresent = watch(`attendantRecords.${index}.isPresent`);
                      return (
                        <Tr key={field.id}>
                          <Td>
                            {selectedLesson.attendanceRecord[index].student.user.firstName}{' '}
                            {selectedLesson.attendanceRecord[index].student.user.lastName}
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
                                      setValue(`attendantRecords.${index}.isPresent`, true);
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
                                  name={field.name}
                                  onChange={e => {
                                    field.onChange(e);
                                    console.log(e);
                                    if (!e.target.checked) {
                                      setValue(`attendantRecords.${index}.mark`, '');
                                    }
                                  }}
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
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={onClose} mr={3}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSubmit(onSubmit)} isDisabled={!isDirty}>
              {t('save')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default CourseGroupRegister;
