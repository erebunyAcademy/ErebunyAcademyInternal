import { ExamDataListModel, ExamListModel } from '@/utils/models/exam';
import { ExamValidation } from '@/utils/validation/exam';
import $apiClient from '../axiosClient';
import { QueryParams } from '../types/common';

export class ExamService {
  static list(params?: QueryParams) {
    return $apiClient.get<ExamListModel>('/exams/list', { params });
  }
  static createExam(exam: ExamValidation) {
    return $apiClient.post('/exams', exam);
  }
  static getExamById(id: string): Promise<ExamDataListModel> {
    return $apiClient.get(`/exams/${id}`);
  }
}
