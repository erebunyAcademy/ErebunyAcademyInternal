import { FacultyAdminListModel, FacultySignupListModel } from '@/utils/models/faculty';
import $apiClient from '../axiosClient';
import { QueryParams } from '../types/common';

export class FacultyService {
  static facultyList(params?: QueryParams) {
    console.log({ params });
    return $apiClient.get<FacultyAdminListModel>('/faculties/list', { params });
  }

  static list() {
    return $apiClient.get<FacultySignupListModel>('/faculties');
  }
}
