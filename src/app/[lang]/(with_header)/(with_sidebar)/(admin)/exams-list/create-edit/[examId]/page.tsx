import { ExamService } from '@/api/services/exam.service';
import CreateEditExam from '@/components/pages/CreateEditExam';
import { ROUTE_EXAMS } from '@/utils/constants/routes';

const CreateEdit = async ({ params }: { params: { examId: string } }) => {
  const exam = await ExamService.getExamById(params.examId);

  return <CreateEditExam exam={exam} />;
};

export default CreateEdit;
