import { FC, memo } from 'react';
import { Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { ExamService } from '@/api/services/exam.service';
import Modal from '../Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  examId: string;
  onFinish: () => void;
}

const ExamResultsModal: FC<Props> = ({ isOpen, onClose, examId, onFinish }) => {
  const { data, isSuccess } = useQuery({
    queryKey: ['exam-results', examId],
    queryFn: () => ExamService.getResults(examId),
    enabled: !!(isOpen && examId),
  });

  const result = `${data?.rightAnswers || 0} / ${data?.total || 0}`;

  if (!isSuccess) {
    return null;
  }

  return (
    <Modal isOpen={isOpen && isSuccess} onClose={onClose} primaryAction={onFinish} title="Results">
      <Text fontSize={20}>{result}</Text>
    </Modal>
  );
};

export default memo(ExamResultsModal);
