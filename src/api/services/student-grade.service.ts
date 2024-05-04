import $apiClient from '../axiosClient';

export class StudentGradeService {
  static getStudentGradeList() {
    return $apiClient.get('/student-grades/list');
  }
}
