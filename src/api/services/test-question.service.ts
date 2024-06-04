import { LanguageTypeEnum } from '@prisma/client';
import { TestQuestionListModel } from '@/utils/models/test-question.model';
import { TestQuestionValidation } from '@/utils/validation/exam';
import $apiClient from '../axiosClient';

export class TestQuestionService {
  static getTestQuestionsBySubjectId(subjectId: string, language: LanguageTypeEnum) {
    return $apiClient.get<TestQuestionListModel>(`/test-question/subject/${subjectId}/${language}`);
  }
  static createTestQuestions(
    data: TestQuestionValidation,
    subjectId: string,
    language: LanguageTypeEnum,
  ) {
    return $apiClient.post<boolean>(`/test-question/create/${subjectId}/${language}`, data);
  }
}
