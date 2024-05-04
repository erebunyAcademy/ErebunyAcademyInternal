import { StudentsListModel } from '@/utils/models/student';
import $apiClient from '../axiosClient';
import { QueryParams } from '../types/common';

export class StudentService {
  static list(params: QueryParams) {
    console.log({ params });
    return $apiClient.get<StudentsListModel>('/students/list', { params });
  }
}
