import React from 'react';
import { redirect } from 'next/navigation';
import SelectExamLanguageModal from '@/components/molecules/SelectExamLanguageModal/page';
import { ExamsResolver } from '@/lib/prisma/resolvers/exam.resolver';
import { ROUTE_EXAMINATION } from '@/utils/constants/routes';

const Examination = async ({ params }: { params: { examId: string } }) => {
  const examTranslation = await ExamsResolver.getExamTranslationByExamId(params.examId);

  if (!examTranslation?.examLanguages) {
    redirect(ROUTE_EXAMINATION);
  }

  return (
    <SelectExamLanguageModal
      examTranslation={examTranslation?.examLanguages}
      examId={params.examId}
    />
  );
};

export default Examination;
