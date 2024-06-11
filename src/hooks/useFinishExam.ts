import { useMutation } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { ExamService } from '@/api/services/exam.service';
import { ROUTE_STUDENT_EXAM_LIST } from '@/utils/constants/routes';

const useFinishExam = () => {
  return useMutation<boolean, { message: string }, string>({
    mutationFn: ExamService.finishExam,
    onSuccess() {
      redirect(ROUTE_STUDENT_EXAM_LIST);
    },
  });
};

export default useFinishExam;
