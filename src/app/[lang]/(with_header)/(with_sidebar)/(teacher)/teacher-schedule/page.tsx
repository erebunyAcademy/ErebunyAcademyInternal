'use client';
import React, { Fragment } from 'react';
import { Button, Flex } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { v4 as uuidv4 } from 'uuid';
import { TeacherService } from '@/api/services/teacher.service';
import SimpleTable from '@/components/organisms/SimpleTable';
import {
  TeacherNoCyclicScheduleListSingleType,
  TeacherScheduleListSingleType,
} from '@/utils/models/teachers';

const StudentSchedule = () => {
  const t = useTranslations();

  const { data: cyclicData } = useQuery({
    queryFn: TeacherService.getTeacherCyclicSchedule,
    queryKey: ['teacher-cyclic-schedule-list'],
    initialData: [],
  });

  const { data: noCyclicData } = useQuery({
    queryFn: TeacherService.getTeacherNoCyclicSchedule,
    queryKey: ['teacher-no-cyclic-schedule-list'],
    initialData: [],
  });

  const cyclicColumnHelper = createColumnHelper<TeacherScheduleListSingleType>();

  const cyclicScheduleColumns = [
    cyclicColumnHelper.accessor('id', {
      id: uuidv4(),
      header: t('seeDetails'),
      cell: info => (
        <Button as={Link} href={`/no-cyclic-schedule/${info.getValue()}`} variant="link">
          {t('seeDetails')}
        </Button>
      ),
    }),
    cyclicColumnHelper.accessor('title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('title'),
    }),
    cyclicColumnHelper.accessor('examType', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('examType'),
    }),
    cyclicColumnHelper.accessor('startDayDate', {
      id: uuidv4(),
      cell: info => dayjs(info.getValue()).format('YYYY-MM-DD'),
      header: t('start'),
    }),
    cyclicColumnHelper.accessor('endDayDate', {
      id: uuidv4(),
      cell: info => dayjs(info.getValue()).format('YYYY-MM-DD'),
      header: t('end'),
    }),
    cyclicColumnHelper.accessor('subject.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('subject'),
    }),
    cyclicColumnHelper.accessor('courseGroup.course.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('course'),
    }),
    cyclicColumnHelper.accessor('courseGroup.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('courseGroup'),
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
      cell: info => dayjs(info.getValue()).format('YYYY-MM-DD'),
      header: t('createdAt'),
    }),
  ];

  const notCyclicyclicColumnHelper = createColumnHelper<TeacherNoCyclicScheduleListSingleType>();

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
    notCyclicyclicColumnHelper.accessor('courseGroup.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('courseGroup'),
    }),
    notCyclicyclicColumnHelper.accessor('courseGroup.course.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('course'),
    }),
    notCyclicyclicColumnHelper.accessor('title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('title'),
    }),
    notCyclicyclicColumnHelper.accessor('subject.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('subject'),
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
    notCyclicyclicColumnHelper.accessor('createdAt', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('createdAt'),
    }),
  ];

  return (
    <Fragment>
      <Flex flexDirection="column" gap="100px" width="100%" mt="50px">
        {cyclicData.length > 0 && (
          <SimpleTable columns={cyclicScheduleColumns as any} data={cyclicData} title="schedule" />
        )}

        {noCyclicData.length > 0 && (
          <SimpleTable
            columns={notCyclicScheduleColumns as any}
            data={noCyclicData}
            title="schedule"
          />
        )}
      </Flex>
    </Fragment>
  );
};

export default StudentSchedule;
