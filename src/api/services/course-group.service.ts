import { CreateEditStudentGradeGroupValidation } from '@/studentGradeGroup';
import { CourseGroupAdminListModel, PublicCourseGroupListModel } from '@/utils/models/courseGroup';
import $apiClient from '../axiosClient';
import { QueryParams } from '../types/common';

type UpdateStudentGradeGroupArgs = {
  data: CreateEditStudentGradeGroupValidation;
  id: string;
};

export class CourseGroupService {
  static studentGradeGroupList(params?: QueryParams) {
    return $apiClient.get<CourseGroupAdminListModel>('/course-group/list', {
      params,
    });
  }
  static list() {
    return $apiClient.get<PublicCourseGroupListModel>('/course-group');
  }

  static createStudentGradeGroup(input: CreateEditStudentGradeGroupValidation) {
    return $apiClient.post<CreateEditStudentGradeGroupValidation>('/course-group', input);
  }
  static updateStudentGradeGroup(input: UpdateStudentGradeGroupArgs) {
    const { id, data } = input;
    return $apiClient.patch<CreateEditStudentGradeGroupValidation>(`/course-group/${id}`, data);
  }
  static deleteStudentGradeGroup(id: string) {
    return $apiClient.delete<CreateEditStudentGradeGroupValidation>(`/course-group/${id}`);
  }

  static getStudentGradeGroupByStudentGradeId(id: string) {
    return $apiClient.get(`/course-group/courses/${id}`);
  }
}
