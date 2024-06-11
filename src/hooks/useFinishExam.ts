import { useMutation } from '@tanstack/react-query';
import { ExamService } from '@/api/services/exam.service';

const useFinishExam = () => {
  return useMutation<boolean, { message: string }, string>({
    mutationFn: ExamService.finishExam,
  });
};

export default useFinishExam;
