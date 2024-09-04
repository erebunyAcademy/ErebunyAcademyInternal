import {
  CourseListDataModel,
  GetCoursesListByFacultyId,
  GetCoursesListModel,
} from '@/utils/models/course';
import { CreateEditCourseValidation } from '@/utils/validation/courses';
import $apiClient from '../axiosClient';
import { QueryParams } from '../types/common';

type UpdateCourseArgs = {
  data: CreateEditCourseValidation;
  id: string;
};

export class CourseService {
  static courseList(params?: QueryParams) {
    return $apiClient.get<CourseListDataModel>('/courses/list', { params });
  }
  static list(): Promise<GetCoursesListModel> {
    return $apiClient.get<GetCoursesListModel>('/courses');
  }

  static createCourse(input: CreateEditCourseValidation) {
    return $apiClient.post<CreateEditCourseValidation>('/courses', input);
  }

  static updateCourse(input: UpdateCourseArgs) {
    const { id, data } = input;
    return $apiClient.patch<CreateEditCourseValidation>(`/courses/${id}`, data);
  }

  static deleteCourse(id: string) {
    return $apiClient.delete<CreateEditCourseValidation>(`/courses/${id}`);
  }

  static getCourseByFacultyId(id: string): Promise<GetCoursesListByFacultyId> {
    return $apiClient.get<GetCoursesListByFacultyId>(`/courses/faculty/${id}`);
  }
}
