import { useMutation } from '@tanstack/react-query';
import { ExamService } from '@/api/services/exam.service';
import { FinishExamValidation } from '@/utils/validation/exam';

const useFinishExam = () => {
  return useMutation<boolean, { message: string }, FinishExamValidation>({
    mutationFn: ExamService.finishExam,
  });
};

export default useFinishExam;
