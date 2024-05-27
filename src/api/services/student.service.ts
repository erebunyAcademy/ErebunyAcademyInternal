import { StudentsListModel, UserStudentModel } from '@/utils/models/student';
import $apiClient from '../axiosClient';
import { QueryParams } from '../types/common';

export class StudentService {
  static list(params: QueryParams) {
    return $apiClient.get<StudentsListModel>('/students/list', { params });
  }
  static getStudentsByCourseGroupId(id: string) {
    return $apiClient.get<UserStudentModel>(`/students/course-group/${id}`);
  }
}
