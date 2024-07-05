'use client';
import React from 'react';
import { Box } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { v4 as uuidv4 } from 'uuid';
import { ExamService } from '@/api/services/exam.service';
import SimpleTable from '@/components/organisms/SimpleTable';
import { GetStudentExamResult } from '@/utils/models/exam';

const ExamResult = ({ params }: { params: { examId: string } }) => {
  const t = useTranslations();
  const { data } = useQuery({
    queryKey: ['student-exam-result'],
    queryFn: ExamService.getAllStudentsExamResult.bind(null, params.examId),
  });

  const columnHelper = createColumnHelper<GetStudentExamResult>();

  const columns = [
    columnHelper.accessor('student.user.firstName', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('firstName'),
    }),
    columnHelper.accessor('student.user.lastName', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('lastName'),
    }),
    columnHelper.accessor('student.user.email', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('email'),
    }),
    columnHelper.accessor('rightAnswers', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('rightAnswers'),
    }),
    columnHelper.accessor('total', {
      id: uuidv4(),
      cell: info => info.getValue(),
      header: t('totalQuestions'),
    }),
  ];

  return (
    <Box>
      {data && <SimpleTable columns={columns as any} data={data} title="studentsAnswers" />}
    </Box>
  );
};

export default ExamResult;
