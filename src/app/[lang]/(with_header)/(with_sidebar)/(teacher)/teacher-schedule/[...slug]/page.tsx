import { redirect } from 'next/navigation';
import { Locale } from '@/i18n';
import { ScheduleResolver } from '@/lib/prisma/resolvers/schedule.resolver';
import { ROUTE_TEACHER_SCHEDULE } from '@/utils/constants/routes';
import AcademicRegister from './_components/AcademicRegister';

export default async function HeaderLayout({
  params,
  searchParams,
}: Readonly<{
  params: { slug: string[]; lang: Locale };
  searchParams: { lessonOfTheDay: string };
}>) {
  const [scheduleId] = params.slug;

  const schedule = await ScheduleResolver.getScheduleById(scheduleId, searchParams.lessonOfTheDay);

  if (!schedule) {
    return redirect(ROUTE_TEACHER_SCHEDULE);
  }

  return <AcademicRegister schedule={schedule} lang={params.lang} />;
}
