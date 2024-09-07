'use client';
import React from 'react';
import { Table, Tbody, Td, Thead, Tr } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { AcademicRegisterService } from '@/api/services/academic-register.service';
import { StudentAcademicRegisterDataType } from '@/utils/models/academic-register';

const CourseGroupRegister = ({
  params: { courseGroupId },
}: {
  params: { courseGroupId: string };
}) => {
  const { data } = useQuery({
    queryFn: AcademicRegisterService.getCourseGroupAcademicRegister.bind(null, courseGroupId),
    queryKey: ['academic-register', courseGroupId],
    initialData: [] as StudentAcademicRegisterDataType,
    enabled: !!courseGroupId,
  });
  return (
    <Table>
      <Thead></Thead>
      <Tbody>
        {data.map(academicRegisterDay => (
          <Tr key={academicRegisterDay.id}>
            <Td rowSpan={academicRegisterDay.academicRegisterLessons.length}>
              {dayjs(academicRegisterDay.createdAt).format('DD/MM/YYYY')}
            </Td>
            {academicRegisterDay.academicRegisterLessons.map(lesson => (
              <Td key={lesson.id}> {lesson.lessonOfTheDay} {lesson.} </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default CourseGroupRegister;
