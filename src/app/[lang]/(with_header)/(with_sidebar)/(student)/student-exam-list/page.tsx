import React from 'react';
import StudentExamList from '@/components/pages/StudentExamList';
import { Locale } from '@/i18n';
import { serverSession } from '@/pages/api/auth/[...nextauth]';

const StiudentExamList = async ({ params }: { params: { lang: Locale } }) => {
  const session = await serverSession();

  return <StudentExamList user={session?.user!} lang={params.lang} />;
};

export default StiudentExamList;
