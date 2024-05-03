'use client';
import { useQuery } from '@tanstack/react-query';
import { SubjectService } from '@/api/services/subject.service';

const SubjectList = () => {
  const { data } = useQuery({
    queryKey: [],
    queryFn: SubjectService.getSubjectList,
  });
  console.log(data);
  
  return <div>SubjectList</div>;
};

export default SubjectList;
