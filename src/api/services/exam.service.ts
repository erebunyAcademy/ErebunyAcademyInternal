import { LanguageTypeEnum } from '@prisma/client';
import { ExamDataModel, ExamListModel, ExamTranslation } from '@/utils/models/exam';
import { CreateExamValidation, OptionalExamValidation } from '@/utils/validation/exam';
import $apiClient from '../axiosClient';
import { QueryParams } from '../types/common';

export class ExamService {
  static list(params?: QueryParams) {
    return $apiClient.get<ExamListModel>('/exams/list', { params });
  }

  static getExamById(id: string): Promise<ExamDataModel> {
    return $apiClient.get(`/exams/${id}`);
  }
  static async getExamTranslation(examId: string, language: LanguageTypeEnum) {
    return $apiClient.get<ExamTranslation>(`/exams/translation/${examId}/${language}`);
  }

  static createExamTranslation(
    examId: string,
    language: LanguageTypeEnum,
    input: OptionalExamValidation,
  ) {
    return $apiClient.post(`/exams/translation/${examId}/${language}`, input);
  }

  // /translation/:translationId/test/:testQuestionId
  static getExamTestQuestion(examTranslationId: string, testQuestionId: string) {
    return $apiClient.get(`/exams/translation/${examTranslationId}`, { params: testQuestionId });
  }

  static async updateExamTranslation(
    examId: string,
    language: LanguageTypeEnum,
    input: OptionalExamValidation,
  ) {
    return $apiClient.patch(`/exams/translation/${examId}/${language}`, input);
  }
  // /translation/:examId/:language
  static createExam(input: CreateExamValidation) {
    return $apiClient.post('/exams', input);
  }

  static deleteExamById(id: string) {
    return $apiClient.delete(`/exams/${id}`);
  }
}
