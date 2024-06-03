import { Locale } from '@/i18n';
import { TestQuestionListModel } from '@/utils/models/test-question.model';
import { TestQuestionValidation } from '@/utils/validation/exam';
import $apiClient from '../axiosClient';

export class TestQuestionService {
  static getTestQuestionsBySubjectId(subjectId: string) {
    return $apiClient.get<TestQuestionListModel>(`/test-question/subject/${subjectId}`);
  }
  static createTestQuestions(data: TestQuestionValidation, subjectId: string, language: Locale) {
    return $apiClient.post<boolean>(`/test-question/create/${subjectId}/${language}`, data);
  }
}
