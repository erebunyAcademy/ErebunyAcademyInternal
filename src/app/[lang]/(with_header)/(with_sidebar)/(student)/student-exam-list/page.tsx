'use client';
import { Heading, Stack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { StudentService } from '@/api/services/student.service';

const StudentExamList = () => {
  // const data = await StudentService.getStudentExams();
  const { data } = useQuery({ queryFn: StudentService.getStudentExams, queryKey: ['exams'] });

  return (data || []).map(({ exam }) => (
    <Stack key={exam.id}>
      {exam.examLanguages.map((examTranslation, i: number) => (
        <Stack key={i}>
          <Heading as={Link} href={`/examination/${exam.id}`}>
            {examTranslation.title}
          </Heading>
        </Stack>
      ))}
    </Stack>
  ));
};

export default StudentExamList;
