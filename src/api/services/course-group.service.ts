import {
  CourseGroupAdminListModel,
  GetCourseGroupsBySubjectId,
  PublicCourseGroupListModel,
} from '@/utils/models/courseGroup';
import { CreateEditCourseGroupValidation } from '@/utils/validation/courseGroup';
import $apiClient from '../axiosClient';
import { QueryParams } from '../types/common';

type UpdateCourseGroupArgs = {
  data: CreateEditCourseGroupValidation;
  id: string;
};

export class CourseGroupService {
  static courseGroupList(params?: QueryParams) {
    return $apiClient.get<CourseGroupAdminListModel>('/course-group/list', {
      params,
    });
  }
  static list() {
    return $apiClient.get<PublicCourseGroupListModel>('/course-group');
  }

  static createCourseGroup(input: CreateEditCourseGroupValidation) {
    return $apiClient.post<CreateEditCourseGroupValidation>('/course-group', input);
  }
  static updateCourseGroup(input: UpdateCourseGroupArgs) {
    const { id, data } = input;
    return $apiClient.patch<CreateEditCourseGroupValidation>(`/course-group/${id}`, data);
  }
  static deleteCourseGroup(id: string) {
    return $apiClient.delete<CreateEditCourseGroupValidation>(`/course-group/${id}`);
  }

  static getCourseGroupByCourseId(id: string) {
    return $apiClient.get(`/course-group/courses/${id}`);
  }

  static getCourseGroupsBySubjectId(subjectId: string) {
    return $apiClient.get<GetCourseGroupsBySubjectId>(`/course-group/subjects/${subjectId}`);
  }
}
