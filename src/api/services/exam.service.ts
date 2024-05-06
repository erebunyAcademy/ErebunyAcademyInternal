import $apiClient from '../axiosClient';

export class ExamService {
  static createExam() {
    return $apiClient.post('/exams');
  }
  static getExamById(id: number) {
    return $apiClient.get(`/exams/${id}`);
  }
}
