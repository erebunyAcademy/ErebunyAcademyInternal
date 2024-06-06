import React from 'react';
import { redirect } from 'next/navigation';
import SelectExamLanguageModal from '@/components/molecules/SelectExamLanguageModal/page';
import { Locale } from '@/i18n';
import { ExamsResolver } from '@/lib/prisma/resolvers/exam.resolver';
import { ROUTE_STUDENT_EXAM_LIST } from '@/utils/constants/routes';
import { languagePathHelper } from '@/utils/helpers/language';

const Examination = async ({ params }: { params: { examId: string; lang: Locale } }) => {
  const examTranslation = await ExamsResolver.getExamTranslationByExamId(params.examId);

  console.log(examTranslation?.examLanguages);

  if (!examTranslation?.examLanguages) {
    redirect(languagePathHelper(params.lang, ROUTE_STUDENT_EXAM_LIST));
  }

  return (
    <SelectExamLanguageModal
      examTranslation={examTranslation?.examLanguages}
      examId={params.examId}
    />
  );
};

export default Examination;
