'use client';
import React, { Fragment } from 'react';
import { Button, Flex } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { v4 as uuidv4 } from 'uuid';
import { StudentService } from '@/api/services/student.service';
import SimpleTable from '@/components/organisms/SimpleTable';
import { Locale } from '@/i18n';
import { languagePathHelper } from '@/utils/helpers/language';
import { StudentScheduleListSingleType } from '@/utils/models/schedule';

const StudentSchedule = ({ params }: { params: { lang: Locale } }) => {
  const t = useTranslations();

  const { data: cyclicData } = useQuery({
    queryFn: StudentService.getStudentSchedules,
    queryKey: ['student-cyclic-schedule-list'],
    initialData: [],
  });

  const cyclicColumnHelper = createColumnHelper<StudentScheduleListSingleType>();

  const cyclicScheduleColumns = [
    cyclicColumnHelper.accessor('id', {
      id: uuidv4(),
      header: t('seeDetails'),
      cell: info => (
        <Button
          as={Link}
          href={`${languagePathHelper(params.lang || 'en', `/schedules/${info.getValue()}`)}`}
          variant="link">
          {t('seeDetails')}
        </Button>
      ),
    }),
    cyclicColumnHelper.accessor('title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('title'),
    }),
    cyclicColumnHelper.accessor('description', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('description'),
    }),
    cyclicColumnHelper.accessor('totalHours', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('totalHours'),
    }),
    cyclicColumnHelper.accessor('createdAt', {
      id: uuidv4(),
      cell: info => (info.getValue() ? t('yes') : t('no')),
      header: t('createdAt'),
    }),
  ];

  return (
    <Fragment>
      <Flex flexDirection="column" gap="100px" width="100%" mt="50px">
        {cyclicData.length && (
          <SimpleTable columns={cyclicScheduleColumns} data={cyclicData} title="schedule" />
        )}
      </Flex>
    </Fragment>
  );
};

export default StudentSchedule;
