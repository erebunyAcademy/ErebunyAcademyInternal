import React from 'react';
import StudentExamList from '@/components/pages/StudentExamList';
import { serverSession } from '@/pages/api/auth/[...nextauth]';

const StiudentExamList = async () => {
  const session = await serverSession();

  return <StudentExamList user={session?.user!} />;
};

export default StiudentExamList;
