import { Box } from '@chakra-ui/react';
import { redirect } from 'next/navigation';
import ExamTimer from '@/components/molecules/ExamTimer';
import { ExamsResolver } from '@/lib/prisma/resolvers/exam.resolver';
import { serverSession } from '@/pages/api/auth/[...nextauth]';
import { ROUTE_STUDENT_EXAM_LIST } from '@/utils/constants/routes';

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { examId: string; examTranslationId: string };
}>) {
  const session = await serverSession();

  const [examDurationInfo, isFinished] = await Promise.all([
    ExamsResolver.getExamDurationInfo(params.examId),
    ExamsResolver.getIsFinished(session?.user?.student?.id, params.examId),
  ]);
  if (!examDurationInfo || isFinished) {
    redirect(ROUTE_STUDENT_EXAM_LIST);
  }

  return (
    <Box>
      {examDurationInfo && (
        <ExamTimer
          startTime={examDurationInfo.examStartTime!}
          durationInMinutes={examDurationInfo.duration}
          examId={params.examId}
          examTranslationId={params.examTranslationId}
        />
      )}
      {children}
    </Box>
  );
}
