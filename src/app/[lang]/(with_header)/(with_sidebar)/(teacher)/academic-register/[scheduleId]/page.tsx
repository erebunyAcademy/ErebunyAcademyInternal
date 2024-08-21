import { AcademicRegisterResolver } from '@/lib/prisma/resolvers/academic-register.resolver';
import { StudentResolver } from '@/lib/prisma/resolvers/student.resolver';
import { serverSession } from '@/pages/api/auth/[...nextauth]';
import { Maybe } from '@/utils/models/common';
import AcademicRegister from './_components/AcademicRegister';

const AcademicRegisterPage = async ({
  params: { scheduleId },
  searchParams: { lessonOfTheDay },
}: {
  params: { scheduleId: string };
  searchParams: { lessonOfTheDay: Maybe<string> };
}) => {
  const session = await serverSession();
  if (!scheduleId || !session?.user) {
    return null;
  }
  const schedule = await AcademicRegisterResolver.getScheduleRecordById(scheduleId, session.user);
  const students = await StudentResolver.getStudentsByCourseGroupId(schedule.courseGroupId);
  const academicRegister = await AcademicRegisterResolver.getAcademicRegister(
    schedule.courseGroupId,
    schedule.id,
    session.user,
  );

  return (
    <AcademicRegister
      students={students}
      academicRegister={academicRegister}
      schedule={schedule}
      lessonOfTheDay={lessonOfTheDay}
    />
  );
};

export default AcademicRegisterPage;
