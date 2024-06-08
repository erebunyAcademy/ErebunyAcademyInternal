import { StudentExams, StudentsListModel, UserStudentModel } from '@/utils/models/student';
import { UpdateStudentValidation } from '@/utils/validation/student';
import $apiClient from '../axiosClient';
import { QueryParams } from '../types/common';

export class StudentService {
  static list(params: QueryParams) {
    return $apiClient.get<StudentsListModel>('/students/list', { params });
  }
  static getStudentsByCourseGroupId(id: string) {
    return $apiClient.get<UserStudentModel>(`/students/course-group/${id}`);
  }
  static getStudentExams() {
    return $apiClient.get<StudentExams>('/students/exams');
  }
  static updateStudentData(input: UpdateStudentValidation, studentId: string) {
    return $apiClient.patch(`/students/${studentId}`, input);
  }
}
