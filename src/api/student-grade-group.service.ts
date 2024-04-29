import $apiClient from './axiosClient';

export class StudentGradeGroupService {
  static getStudentGradeGroupList() {
    return $apiClient.get('/student-grade-group/list');
  }
}
