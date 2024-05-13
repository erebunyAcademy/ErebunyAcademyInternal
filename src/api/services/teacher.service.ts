import { TeachersListModel } from '@/utils/models/teachers';
import $apiClient from '../axiosClient';
import { QueryParams } from '../types/common';

export class TeacherService {
  static list(params: QueryParams) {
    return $apiClient.get<TeachersListModel>('/teachers/list', { params });
  }
}
