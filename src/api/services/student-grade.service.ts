import {
  StudentGradeAdminListModel,
  StudentGradeSignupListModel,
} from '@/utils/models/studentGrade';
import $apiClient from '../axiosClient';
import { QueryParams } from '../types/common';

export class StudentGradeService {
  static studentGradeList(params?: QueryParams) {
    return $apiClient.get<StudentGradeAdminListModel>('/student-grades/list', { params });
  }
  static list() {
    return $apiClient.get<StudentGradeSignupListModel>('/student-grades');
  }
}
