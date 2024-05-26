import { TestQuestionListModel } from '@/utils/models/test-question.model';
import $apiClient from '../axiosClient';

export class SubjectService {
  static getTestQuestionsBySubjectId(subjectId: string) {
    return $apiClient.get<TestQuestionListModel>(`/test-question/subject/${subjectId}`);
  }
}
