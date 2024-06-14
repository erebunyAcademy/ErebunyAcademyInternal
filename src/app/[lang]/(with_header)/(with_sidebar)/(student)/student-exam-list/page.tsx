import React from 'react';
import { redirect } from 'next/navigation';
import StudentExamList from '@/components/pages/StudentExamList';
import { serverSession } from '@/pages/api/auth/[...nextauth]';
import { ROUTE_DASHBOARD } from '@/utils/constants/routes';

const StiudentExamList = async () => {
  const session = await serverSession();
  if (!session?.user) {
    redirect(ROUTE_DASHBOARD);
  }
  return <StudentExamList user={session?.user} />;
};

export default StiudentExamList;
