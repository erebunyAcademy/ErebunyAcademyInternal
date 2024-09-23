import React from 'react';
import { redirect } from 'next/navigation';
import { Locale } from '@/i18n';
import { ScheduleResolver } from '@/lib/prisma/resolvers/schedule.resolver';
import { ROUTE_DASHBOARD } from '@/utils/constants/routes';
import { Maybe } from '@/utils/models/common';
import { CourseGroupScheduleList } from '@/utils/models/schedule';
import ScheduleDetails from './_components/Schedule';

const ScheduleItem = async ({ params }: { params: { slug: string[]; lang: Locale } }) => {
  const [scheduleId, courseGroupId] = params.slug;
  let courseGroupScheduleList: Maybe<CourseGroupScheduleList> = null;

  if (!scheduleId) {
    redirect(ROUTE_DASHBOARD);
  }

  if (courseGroupId) {
    courseGroupScheduleList = await ScheduleResolver.getScheduleCourseGroupList(
      scheduleId,
      courseGroupId,
    );
  }

  return (
    <ScheduleDetails
      courseGroup={courseGroupScheduleList}
      scheduleId={scheduleId}
      lang={params.lang}
    />
  );
};

export default ScheduleItem;
