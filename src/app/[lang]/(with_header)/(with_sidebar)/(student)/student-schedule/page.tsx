'use client';
import React, { Fragment } from 'react';
import { Flex } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { v4 as uuidv4 } from 'uuid';
import { StudentService } from '@/api/services/student.service';
import SimpleTable from '@/components/organisms/SimpleTable';
import { StudentNoCyclicScheduleListSingleType, StudentScheduleListSingleType } from '@/utils/models/schedule';

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
    cyclicColumnHelper.accessor("createdAt", {
      id: uuidv4(),
      cell: info => (info.getValue() ? t('yes') : t('no')),
      header: t('createdAt'),
    }),
    cyclicColumnHelper.accessor("subject.title", {
      id: uuidv4(),
      cell: info => info.getValue() ,
      header: t('subject'),
    }),
  ];


    const notCyclicyclicColumnHelper = createColumnHelper<StudentNoCyclicScheduleListSingleType>();

  const notCyclicScheduleColumns = [
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
    notCyclicyclicColumnHelper.accessor("createdAt", {
      id: uuidv4(),
      cell: info => (info.getValue() ? t('yes') : t('no')),
      header: t('createdAt'),
    }),
    notCyclicyclicColumnHelper.accessor("subject.title", {
      id: uuidv4(),
      cell: info => info.getValue() ,
      header: t('subject'),
    }),
  ];

  console.log({cyclicData, noCyclicData})

  return (
    <Fragment>

      <Flex flexDirection="column" gap="100px" width="100%" mt="50px">


      {cyclicData.length  && (
        <SimpleTable columns={cyclicScheduleColumns as any} data={cyclicData} title="schedule" />
      )}

      {noCyclicData.length  && (
        <SimpleTable columns={notCyclicScheduleColumns as any} data={noCyclicData} title="schedule" />
      )}
      </Flex>

    </Fragment>
  );
};

export default StudentSchedule;
