import { StudentsListModel } from '@/utils/models/student';
import $apiClient from '../axiosClient';
import { QueryParams } from '../types/common';

export class FacultyService {
  static facultyList(params: QueryParams) {
    console.log({ params });
    return $apiClient.get<StudentsListModel>('/faculties/list', { params });
  }
}
