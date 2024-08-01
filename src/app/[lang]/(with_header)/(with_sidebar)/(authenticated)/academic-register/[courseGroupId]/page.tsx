import { StudentResolver } from '@/lib/prisma/resolvers/student.resolver';
import AcademicRegister from './_components/AcademicRegister';

const AcademicRegisterPage = async ({
  params: { courseGroupId },
}: {
  params: { courseGroupId: string };
}) => {
  if (!courseGroupId) {
    return null;
  }
  const students = await StudentResolver.getStudentsByCourseGroupId(courseGroupId);
  return (
    <div>
      <AcademicRegister students={students} />
    </div>
  );
};

export default AcademicRegisterPage;
