'use client';
import { useQuery } from '@tanstack/react-query';
import { StudentGradeGroupService } from '@/api/services/student-grade-group.service';

const StudentGradeGroupList = () => {
  const { data } = useQuery({
    queryKey: [],
    queryFn: StudentGradeGroupService.getStudentGradeGroupList,
  });
  console.log(data);

  return <div>StudentGradeGroupList</div>;
};

export default StudentGradeGroupList;
