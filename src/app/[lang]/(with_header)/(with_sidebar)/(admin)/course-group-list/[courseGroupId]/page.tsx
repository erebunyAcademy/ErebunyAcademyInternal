'use client';
import React, { FC } from 'react';
import { Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { StudentService } from '@/api/services/student.service';

type GroupStudentsProps = {
  params: {
    courseGroupId: string;
  };
};

const GroupStudents: FC<GroupStudentsProps> = ({ params }) => {
  const t = useTranslations();

  const { data: studentsData } = useQuery({
    queryKey: ['students'],
    queryFn: () => StudentService.getStudentsByCourseGroupId(params.courseGroupId),
    initialData: [],
  });

  return (
    <>
      <Text fontSize="28px" textAlign="center" mb="40px">
        {t('studentsList')}
      </Text>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>{t('firstName')}</Th>
              <Th>{t('lastName')}</Th>
              <Th>{t('email')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {studentsData.map(student => (
              <Tr key={student.id} fontSize="18px">
                <Td p="12px">{student.user.firstName}</Td>
                <Td p="12px">{student.user.lastName}</Td>
                <Td p="12px">{student.user.email}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default GroupStudents;
