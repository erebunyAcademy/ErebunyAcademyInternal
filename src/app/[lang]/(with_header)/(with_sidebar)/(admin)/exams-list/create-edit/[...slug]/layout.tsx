import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { Locale } from '@/i18n';
import { ExamsResolver } from '@/lib/prisma/resolvers/exam.resolver';
import { ROUTE_EXAMS } from '@/utils/constants/routes';
import { languagePathHelper } from '@/utils/helpers/language';

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: { slug: string[]; lang: Locale };
}>) {
  const [examId] = params.slug;

  const exam = await ExamsResolver.getExamById(examId);

  if (!exam || exam.status === 'COMPLETED') {
    redirect(languagePathHelper(params.lang, ROUTE_EXAMS));
  }

  return children;
}
