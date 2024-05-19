import { FacultyAdminListModel, FacultySignupListModel } from '@/utils/models/faculty';
import { CreateEditFacultyValidation } from '@/utils/validation/faculty';
import $apiClient from '../axiosClient';
import { QueryParams } from '../types/common';

type UpdateFacultyArgs = {
  data: CreateEditFacultyValidation;
  id: string;
};

export class FacultyService {
  static facultyList(params?: QueryParams) {
    return $apiClient.get<FacultyAdminListModel>('/faculties/list', { params });
  }

  static list(): Promise<FacultySignupListModel> {
    return $apiClient.get<FacultySignupListModel>('/faculties');
  }

  static createFaculty(input: CreateEditFacultyValidation) {
    return $apiClient.post<CreateEditFacultyValidation>('/faculties', input);
  }
  static updateFaculty(input: UpdateFacultyArgs) {
    const { id, data } = input;
    return $apiClient.patch<CreateEditFacultyValidation>(`/faculties/${id}`, data);
  }
  static deleteFaculty(id: string) {
    return $apiClient.delete<CreateEditFacultyValidation>(`/faculties/${id}`);
  }
}
