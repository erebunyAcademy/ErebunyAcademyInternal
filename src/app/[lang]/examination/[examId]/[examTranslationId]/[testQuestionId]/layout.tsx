import { Box } from '@chakra-ui/react';
import { redirect } from 'next/navigation';
import ExamTimer from '@/components/molecules/ExamTimer';
import { ExamsResolver } from '@/lib/prisma/resolvers/exam.resolver';
import { ROUTE_STUDENT_EXAM_LIST } from '@/utils/constants/routes';

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { examId: string };
}>) {
  const examDurationInfo = await ExamsResolver.getExamDurationInfo(params.examId);

  if (!examDurationInfo) {
    redirect(ROUTE_STUDENT_EXAM_LIST);
  }

  return (
    <Box>
      <ExamTimer
        startTime={examDurationInfo.examStartTime!}
        durationInMinutes={examDurationInfo.duration}
      />
      {children}
    </Box>
  );
}
