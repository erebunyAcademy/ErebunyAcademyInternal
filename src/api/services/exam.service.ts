import { LanguageTypeEnum } from '@prisma/client';
import { ExamDataListModel, ExamListModel, ExamTranslation } from '@/utils/models/exam';
import {
  CreateExamValidation,
  ExamValidation,
  OptionalExamValidation,
} from '@/utils/validation/exam';
import $apiClient from '../axiosClient';
import { QueryParams } from '../types/common';

export class ExamService {
  static list(params?: QueryParams) {
    return $apiClient.get<ExamListModel>('/exams/list', { params });
  }
  static createExamTranslation(input: ExamValidation, examId: string) {
    return $apiClient.post(`/exams/${examId}`, input);
  }
  static getExamById(id: string): Promise<ExamDataListModel> {
    return $apiClient.get(`/exams/${id}`);
  }
  static async getExamTranslation(examId: string, language: LanguageTypeEnum) {
    return $apiClient.get<ExamTranslation>(`/exams/translation/${examId}/${language}`);
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
}
