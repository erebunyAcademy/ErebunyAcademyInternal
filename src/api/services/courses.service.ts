import { CourseListDataModel, GetCoursesListModel } from '@/utils/models/course';
import { CreateEditStudentGradeValidation } from '@/utils/validation/studentGrade';
import $apiClient from '../axiosClient';
import { QueryParams } from '../types/common';

type UpdateStudentGradeArgs = {
  data: CreateEditStudentGradeValidation;
  id: string;
};
export class CourseService {
  static courseList(params?: QueryParams) {
    return $apiClient.get<CourseListDataModel>('/courses/list', { params });
  }
  static list(): Promise<GetCoursesListModel> {
    return $apiClient.get<GetCoursesListModel>('/courses');
  }

  static createCourse(input: CreateEditStudentGradeValidation) {
    return $apiClient.post<CreateEditStudentGradeValidation>('/courses', input);
  }
  static updateCourse(input: UpdateStudentGradeArgs) {
    const { id, data } = input;
    return $apiClient.patch<CreateEditStudentGradeValidation>(`/courses/${id}`, data);
  }
  static deleteCourse(id: string) {
    return $apiClient.delete<CreateEditStudentGradeValidation>(`/courses/${id}`);
  }

  static getCourseByFacultyId(id: string) {
    return $apiClient.get(`/courses/faculty/${id}`);
  }
}
