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
import {
  StudentNoCyclicScheduleListSingleType,
  StudentScheduleListSingleType,
} from '@/utils/models/schedule';

const StudentSchedule = () => {
  const t = useTranslations();

  const { data: cyclicData } = useQuery({
    queryFn: StudentService.getStudentCyclicSchedule,
    queryKey: ['student-cyclic-schedule-list'],
    initialData: [],
  });

  const { data: noCyclicData } = useQuery({
    queryFn: StudentService.getStudentNoCyclicSchedule,
    queryKey: ['student-no-cyclic-schedule-list'],
    initialData: [],
  });

  const cyclicColumnHelper = createColumnHelper<StudentScheduleListSingleType>();

  const cyclicScheduleColumns = [
    cyclicColumnHelper.accessor('id', {
      id: uuidv4(),
      header: t('seeDetails'),
      cell: info => (
        <Button as={Link} href={`/cyclic-schedule/${info.getValue()}`} variant="link">
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
    cyclicColumnHelper.accessor('isAssessment', {
      id: uuidv4(),
      cell: info => (info.getValue() ? t('yes') : t('no')),
      header: t('assessment'),
    }),
    cyclicColumnHelper.accessor('createdAt', {
      id: uuidv4(),
      cell: info => (info.getValue() ? t('yes') : t('no')),
      header: t('createdAt'),
    }),
    cyclicColumnHelper.accessor('subject.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('subject'),
    }),
  ];

  const notCyclicyclicColumnHelper = createColumnHelper<StudentNoCyclicScheduleListSingleType>();

  const notCyclicScheduleColumns = [
    cyclicColumnHelper.accessor('id', {
      id: uuidv4(),
      header: t('seeDetails'),
      cell: info => (
        <Button as={Link} href={`/no-cyclic-schedule/${info.getValue()}`} variant="link">
          {t('seeDetails')}
        </Button>
      ),
    }),
    notCyclicyclicColumnHelper.accessor('title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('title'),
    }),
    notCyclicyclicColumnHelper.accessor('description', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('description'),
    }),
    notCyclicyclicColumnHelper.accessor('totalHours', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('totalHours'),
    }),
    notCyclicyclicColumnHelper.accessor('isAssessment', {
      id: uuidv4(),
      cell: info => (info.getValue() ? t('yes') : t('no')),
      header: t('assessment'),
    }),
    notCyclicyclicColumnHelper.accessor('createdAt', {
      id: uuidv4(),
      cell: info => (info.getValue() ? t('yes') : t('no')),
      header: t('createdAt'),
    }),
    notCyclicyclicColumnHelper.accessor('subject.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('subject'),
    }),
  ];

  return (
    <Fragment>
      <Flex flexDirection="column" gap="100px" width="100%" mt="50px">
        {cyclicData.length && (
          <SimpleTable columns={cyclicScheduleColumns} data={cyclicData} title="schedule" />
        )}

        {noCyclicData.length && (
          <SimpleTable columns={notCyclicScheduleColumns} data={noCyclicData} title="schedule" />
        )}
      </Flex>
    </Fragment>
  );
};

export default StudentSchedule;
