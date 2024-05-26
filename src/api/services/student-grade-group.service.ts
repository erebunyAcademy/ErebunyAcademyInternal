import { CreateEditStudentGradeGroupValidation } from '@/studentGradeGroup';
import {
  StudentGradeGroupAdminListModel,
  StudentGradeGroupSignupListModel,
} from '@/utils/models/studentGradeGroup';
import $apiClient from '../axiosClient';
import { QueryParams } from '../types/common';

type UpdateStudentGradeGroupArgs = {
  data: CreateEditStudentGradeGroupValidation;
  id: string;
};

export class StudentGradeGroupService {
  static studentGradeGroupList(params?: QueryParams) {
    return $apiClient.get<StudentGradeGroupAdminListModel>('/student-grade-groups/list', {
      params,
    });
  }
  static list() {
    return $apiClient.get<StudentGradeGroupSignupListModel>('/student-grade-groups');
  }

  static createStudentGradeGroup(input: CreateEditStudentGradeGroupValidation) {
    return $apiClient.post<CreateEditStudentGradeGroupValidation>('/student-grade-groups', input);
  }
  static updateStudentGradeGroup(input: UpdateStudentGradeGroupArgs) {
    const { id, data } = input;
    return $apiClient.patch<CreateEditStudentGradeGroupValidation>(
      `/student-grade-groups/${id}`,
      data,
    );
  }
  static deleteStudentGradeGroup(id: string) {
    return $apiClient.delete<CreateEditStudentGradeGroupValidation>(`/student-grade-groups/${id}`);
  }

  static getStudentGradeGroupByStudentGradeId(id: string) {
    return $apiClient.get(`/student-grade-groups/student-grade/${id}`);
  }
}
