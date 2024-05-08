import { FacultyAdminListModel, FacultySignupListModel } from '@/utils/models/faculty';
import { CreateEditFacultyValidation } from '@/utils/validation/faculty';
import $apiClient from '../axiosClient';
import { QueryParams } from '../types/common';

export class FacultyService {
  static facultyList(params?: QueryParams) {
    return $apiClient.get<FacultyAdminListModel>('/faculties/list', { params });
  }

  static list() {
    return $apiClient.get<FacultySignupListModel>('/faculties');
  }

  static createFaculty(input: CreateEditFacultyValidation) {
    return $apiClient.post<CreateEditFacultyValidation>('/faculties', input);
  }
  static updateFaculty(input: CreateEditFacultyValidation, id: string) {
    console.log(input, id);
    return $apiClient.patch<CreateEditFacultyValidation>(`/faculties/${id}`, input);
  }
}
