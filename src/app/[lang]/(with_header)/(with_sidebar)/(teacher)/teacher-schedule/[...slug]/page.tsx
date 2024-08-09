import { ScheduleResolver } from '@/lib/prisma/resolvers/schedule.resolver';
import AcademicRegister from './_components/AcademicRegister';

export default async function HeaderLayout({
  params,
}: Readonly<{
  params: { slug: string[] };
}>) {
  const [scheduleId] = params.slug;

  const schedule = await ScheduleResolver.getScheduleById(scheduleId);

  return <AcademicRegister schedule={schedule} />;
}
