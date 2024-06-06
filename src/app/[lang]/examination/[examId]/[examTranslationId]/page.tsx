'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ExamService } from '@/api/services/exam.service';

const ExamTranslation = ({
  params: { examTranslationId },
  searchParams,
}: {
  params: { examTranslationId: string };
  searchParams: { questionId: string };
}) => {
  const { data } = useQuery({
    queryKey: ['question', examTranslationId, searchParams.questionId],
    queryFn: ExamService.getExamTestQuestion.bind(null, examTranslationId, searchParams.questionId),
  });

  console.log({ data });

  return <div>ExamTranslation</div>;
};

export default ExamTranslation;
