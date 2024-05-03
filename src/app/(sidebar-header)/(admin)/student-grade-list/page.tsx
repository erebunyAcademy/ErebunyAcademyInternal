'use client';
import { useQuery } from '@tanstack/react-query';
import { StudentGradeService } from '@/api/services/student-grade.service';

const StudentGradeList = () => {
  const { data } = useQuery({
    queryKey: [],
    queryFn: StudentGradeService.getStudentGradeList,
  });
  console.log(data);

  return <div>StudentGradeList</div>;
};

export default StudentGradeList;
