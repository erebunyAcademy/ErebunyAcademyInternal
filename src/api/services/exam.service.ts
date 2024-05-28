import { ExamDataListModel, ExamListModel } from '@/utils/models/exam';
import { CreateExamValidation, ExamValidation } from '@/utils/validation/exam';
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
  static createExam(input: CreateExamValidation) {
    return $apiClient.post('/exams', input);
  }
}
