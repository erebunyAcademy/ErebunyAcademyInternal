import {
  TeacherCyclicScheduleListType,
  TeacherDataModel,
  TeachersListModel,
} from '@/utils/models/teachers';
import $apiClient from '../axiosClient';
import { QueryParams } from '../types/common';

export class TeacherService {
  static list(params: QueryParams) {
    return $apiClient.get<TeachersListModel>('/teachers/list', { params });
  }

  static getTeachers() {
    return $apiClient.get<TeacherDataModel>('/teachers');
  }

  static getTeacherSchedules() {
    return $apiClient.get<TeacherCyclicScheduleListType>('/teachers/schedules');
  }

  static getSelectedTeacherSchedules(selectedTeacherId: string) {
    return $apiClient.get<TeacherCyclicScheduleListType>(`/teachers/${selectedTeacherId}`);
  }
}
