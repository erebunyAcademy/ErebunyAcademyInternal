import { ExamListModel } from '@/utils/models/exam';
import $apiClient from '../axiosClient';
import { QueryParams } from '../types/common';

export class ExamService {
  static list(params?: QueryParams) {
    return $apiClient.get<ExamListModel>('/exams/list', { params });
  }
  static createExam() {
    return $apiClient.post('/exams');
  }
  static getExamById(id: number) {
    return $apiClient.get(`/exams/${id}`);
  }
}
