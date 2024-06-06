import { ReactNode } from 'react';
import { UserRoleEnum } from '@prisma/client';
import { redirect } from 'next/navigation';
import { Locale } from '@/i18n';
import { ExamsResolver } from '@/lib/prisma/resolvers/exam.resolver';
import { serverSession } from '@/pages/api/auth/[...nextauth]';
import { ROUTE_DASHBOARD, ROUTE_SIGN_IN, ROUTE_STUDENT_EXAM_LIST } from '@/utils/constants/routes';
import { languagePathHelper } from '@/utils/helpers/language';

export default async function ExamLyout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: { examId: string; lang: Locale };
}>) {
  const session = await serverSession();

  if (!session?.user) {
    redirect(languagePathHelper(params.lang, ROUTE_SIGN_IN));
  }

  if (session?.user.role !== UserRoleEnum.STUDENT) {
    redirect(languagePathHelper(params.lang, ROUTE_DASHBOARD));
  }

  const exam = await ExamsResolver.checkUserPermissionToStartExam(
    session?.user?.student?.id || '',
    params.examId,
  );

  if (!exam) {
    redirect(languagePathHelper(params.lang, ROUTE_STUDENT_EXAM_LIST));
  }

  return children;
}
