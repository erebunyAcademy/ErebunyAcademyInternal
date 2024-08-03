import { AcademicRegisterResolver } from '@/lib/prisma/resolvers/academic-register.resolver';
import { StudentResolver } from '@/lib/prisma/resolvers/student.resolver';
import { serverSession } from '@/pages/api/auth/[...nextauth]';
import AcademicRegister from './_components/AcademicRegister';

const AcademicRegisterPage = async ({
  params: { scheduleId },
}: {
  params: { scheduleId: string };
}) => {
  const session = await serverSession();
  if (!scheduleId || !session?.user) {
    return null;
  }
  const academicRegister = await AcademicRegisterResolver.getCyclicRegisterById(
    scheduleId,
    session?.user,
  );
  const students = await StudentResolver.getStudentsByCourseGroupId(academicRegister.courseGroupId);

  return (
    <div>
      <AcademicRegister students={students} academicRegister={academicRegister} />
    </div>
  );
};

export default AcademicRegisterPage;
