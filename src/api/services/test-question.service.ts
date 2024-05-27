import { TestQuestionListModel } from '@/utils/models/test-question.model';
import { TestQuestionValidation } from '@/utils/validation/exam';
import $apiClient from '../axiosClient';

export class TestQuestionService {
  static getTestQuestionsBySubjectId(subjectId: string) {
    return $apiClient.get<TestQuestionListModel>(`/test-question/subject/${subjectId}`);
  }
  static createTestQuestions(subjectId: string, input: TestQuestionValidation) {
    return $apiClient.post(`/test-question/subjects/${subjectId}`, input);
  }
}
