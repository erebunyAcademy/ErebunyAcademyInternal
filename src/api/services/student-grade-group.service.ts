import {
  StudentGradeGroupAdminListModel,
  StudentGradeGroupSignupListModel,
} from '@/utils/models/studentGradeGroup';
import $apiClient from '../axiosClient';
import { QueryParams } from '../types/common';

export class StudentGradeGroupService {
  static studentGradeGroupList(params?: QueryParams) {
    return $apiClient.get<StudentGradeGroupAdminListModel>('/student-grade-groups/list', {
      params,
    });
  }
  static list() {
    return $apiClient.get<StudentGradeGroupSignupListModel>('/student-grade-groups/');
  }
}
