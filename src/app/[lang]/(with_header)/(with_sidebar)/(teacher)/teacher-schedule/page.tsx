'use client';
import React, { Fragment } from 'react';
import { Button, Flex, MenuItem } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { v4 as uuidv4 } from 'uuid';
import { TeacherService } from '@/api/services/teacher.service';
import ActionButtons from '@/components/molecules/ActionButtons';
import SimpleTable from '@/components/organisms/SimpleTable';
import { Locale } from '@/i18n';
import { academicYearListData } from '@/utils/constants/common';
import { ROUTE_TEACHER_SCHEDULE } from '@/utils/constants/routes';
import { languagePathHelper } from '@/utils/helpers/language';
import { TeacherScheduleListSingleType } from '@/utils/models/teachers';

const StudentSchedule = ({ params }: { params: { lang: Locale } }) => {
  const router = useRouter();
  const t = useTranslations();

  const { data: cyclicData } = useQuery({
    queryFn: TeacherService.getTeacherSchedules,
    queryKey: ['teacher-cyclic-schedule-list'],
    initialData: [],
  });

  const cyclicColumnHelper = createColumnHelper<TeacherScheduleListSingleType>();

  const scheduleColumns = [
    cyclicColumnHelper.accessor('id', {
      id: uuidv4(),
      cell: ({ getValue }) => (
        <ActionButtons>
          <MenuItem
            color="green"
            onClick={() => {
              router.push(`${ROUTE_TEACHER_SCHEDULE}/${getValue()}`);
            }}>
            {t('startLesson')}
          </MenuItem>
        </ActionButtons>
      ),
      header: t('actions'),
    }),
    cyclicColumnHelper.accessor('id', {
      id: uuidv4(),
      header: t('seeDetails'),
      cell: info => (
        <Button
          as={Link}
          href={`${languagePathHelper(params.lang, `/schedules/${info.getValue()}`)}`}
          variant="link">
          {t('seeDetails')}
        </Button>
      ),
    }),

    cyclicColumnHelper.accessor('courseGroup.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('courseGroup'),
    }),
    cyclicColumnHelper.accessor('courseGroup.course.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('course'),
    }),
    cyclicColumnHelper.accessor('subject.title', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('subject'),
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
    cyclicColumnHelper.accessor('examType', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('examType'),
    }),

    cyclicColumnHelper.accessor('totalHours', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('totalHours'),
    }),

    cyclicColumnHelper.accessor('academicYear', {
      id: uuidv4(),
      cell: info => {
        const academicYear = academicYearListData.find(year => year.id === info.getValue());
        return academicYear?.title;
      },
      header: t('academicYear'),
    }),

    cyclicColumnHelper.accessor('startDayDate', {
      id: uuidv4(),
      cell: info => (info.getValue() ? dayjs(info.getValue()).format('YYYY-MM-DD') : '-'),
      header: t('startDay'),
    }),
    cyclicColumnHelper.accessor('endDayDate', {
      id: uuidv4(),
      cell: info => (info.getValue() ? dayjs(info.getValue()).format('YYYY-MM-DD') : '-'),
      header: t('endDay'),
    }),
    cyclicColumnHelper.accessor('examDate', {
      id: uuidv4(),
      cell: info => (info.getValue() ? dayjs(info.getValue()).format('YYYY-MM-DD') : '-'),
      header: t('examDay'),
    }),
    cyclicColumnHelper.accessor('createdAt', {
      id: uuidv4(),
      cell: info => dayjs(info.getValue()).format('YYYY-MM-DD'),
      header: t('createdAt'),
    }),
  ];

  return (
    <Fragment>
      <Flex flexDirection="column" gap={{ base: '50px', lg: '100px' }} width="100%" my="50px">
        {cyclicData.length > 0 && (
          <SimpleTable columns={scheduleColumns as any} data={cyclicData} title="schedules" />
        )}
      </Flex>
    </Fragment>
  );
};

export default StudentSchedule;
