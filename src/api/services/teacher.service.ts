import { TeachersListModel } from '@/utils/models/teachers';
import $apiClient from '../axiosClient';
import { QueryParams } from '../types/common';

export class TeacherService {
  static list(params: QueryParams) {
    console.log({ params });
    return $apiClient.get<TeachersListModel>('/teachers/list', { params });
  }
}
