'use client';
import { useQuery } from '@tanstack/react-query';
import { FacultyService } from '@/api/services/faculty.service';

const FacultyList = () => {
  const { data } = useQuery({
    queryKey: [],
    queryFn: FacultyService.facultyList,
  });
  console.log(data);

  return <div>FacultyList</div>;
};

export default FacultyList;
