import React from 'react';
import { redirect } from 'next/navigation';
import { AcademicRegisterResolver } from '@/lib/prisma/resolvers/academic-register.resolver';
import { serverSession } from '@/pages/api/auth/[...nextauth]';
import { ROUTE_DASHBOARD } from '@/utils/constants/routes';
import AcademicRegister from './_components/AcademicRegister';

const StudentAcademicRegister = async () => {
  const session = await serverSession();

  if (!session?.user) {
    redirect(ROUTE_DASHBOARD);
  }
  const data = await AcademicRegisterResolver.getStudentAcademicRegisterData(session?.user);

  return <AcademicRegister academicRegisterData={data} />;
};

export default StudentAcademicRegister;
