'use client';
import React from 'react';
import { Button, Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { TeacherService } from '@/api/services/teacher.service';
import NoDataFound from '@/components/molecules/NoDataFound';
import { Locale } from '@/i18n';
import { languagePathHelper } from '@/utils/helpers/language';

const TeacherSchedules = ({
  params: { teacherId, lang },
}: {
  params: { teacherId: string; lang: Locale };
}) => {
  const { data: teacherSchedules } = useQuery({
    queryKey: ['selected-teacher-schedules', teacherId],
    queryFn: () => TeacherService.getSelectedTeacherSchedules(teacherId),
  });
  const t = useTranslations();

  return (
    <TableContainer>
      <Heading fontSize="24px" textAlign="center" m="30px 0 30px 0">
        {t('schedules')}
      </Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>{t('details')}</Th>
            <Th>{t('courseGroupName')}</Th>
            <Th>{t('title')}</Th>
            <Th>{t('totalHours')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {teacherSchedules && teacherSchedules.length > 0 ? (
            teacherSchedules.map(schedule => (
              <Tr key={schedule.id}>
                <Td>
                  <Button
                    as={Link}
                    href={`${languagePathHelper(lang, `/schedules/${schedule.id}`)}`}
                    variant="link">
                    {t('seeDetails')}
                  </Button>
                </Td>
                <Td>{schedule.courseGroup.title}</Td>
                <Td>{schedule.title}</Td>
                <Td>{schedule.totalHours}</Td>
              </Tr>
            ))
          ) : (
            <Tr height="149px">
              <Td colSpan={4} border="none" height="100%">
                <NoDataFound />
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default TeacherSchedules;
