import {
  StudentGradeAdminListModel,
  StudentGradeSignupListModel,
} from '@/utils/models/studentGrade';
import { CreateEditStudentGradeValidation } from '@/utils/validation/studentGrade';
import $apiClient from '../axiosClient';
import { QueryParams } from '../types/common';

type UpdateStudentGradeArgs = {
  data: CreateEditStudentGradeValidation;
  id: string;
};
export class StudentGradeService {
  static studentGradeList(params?: QueryParams) {
    return $apiClient.get<StudentGradeAdminListModel>('/student-grades/list', { params });
  }
  static list(): Promise<StudentGradeSignupListModel> {
    return $apiClient.get<StudentGradeSignupListModel>('/student-grades');
  }

  static createStudentGrade(input: CreateEditStudentGradeValidation) {
    return $apiClient.post<CreateEditStudentGradeValidation>('/student-grades', input);
  }
  static updateStudentGrade(input: UpdateStudentGradeArgs) {
    const { id, data } = input;
    return $apiClient.patch<CreateEditStudentGradeValidation>(`/student-grades/${id}`, data);
  }
  static deleteStudentGrade(id: string) {
    return $apiClient.delete<CreateEditStudentGradeValidation>(`/student-grades/${id}`);
  }

  static getStudentGradeByFacultyId(id: string) {
    return $apiClient.get(`/student-grades/faculty/${id}`);
  }
}
