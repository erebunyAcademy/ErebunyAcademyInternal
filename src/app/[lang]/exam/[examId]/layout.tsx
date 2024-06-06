import type { Metadata } from 'next';
import { Box, Heading, Text } from '@chakra-ui/react';
import { redirect } from 'next/navigation';
import { ExamService } from '@/api/services/exam.service';
import { Locale } from '@/i18n';

export const metadata: Metadata = {
  title: 'Exam',
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { examId: string; lang: Locale };
}>) {
  const exam = await ExamService.getExamById(params.examId);

  if (!exam) {
    return redirect('/exams-list');
  }

  const examByTranslation = exam.examLanguages.find(
    ({ language }) => language === params.lang.toUpperCase(),
  );

  if (!examByTranslation || !examByTranslation?.testQuestions?.length) {
    const examTranslation = exam.examLanguages.find(el => !!el.testQuestions.length);
    if (!examTranslation) {
      return redirect('/exams-list');
    }
    return redirect(`/${examTranslation.language.toLowerCase()}/exam/${exam.id}`);
  }

  return (
    <Box maxW="xl" mx="auto" mt={10} p={5} borderWidth={1} borderRadius="md" boxShadow="lg">
      <Box minH={300}>
        <Heading as="h1" size="xl" mb={4}>
          {examByTranslation.title}
        </Heading>
        <Text fontSize="lg" mb={6}>
          {examByTranslation.description}
        </Text>
      </Box>
      {children}
    </Box>
  );
}
