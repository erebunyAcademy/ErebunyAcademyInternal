import { TeacherCyclicScheduleListType, TeacherDataModel, TeacherNoCyclicScheduleListType, TeachersListModel } from '@/utils/models/teachers';
import $apiClient from '../axiosClient';
import { QueryParams } from '../types/common';

export class TeacherService {
  static list(params: QueryParams) {
    return $apiClient.get<TeachersListModel>('/teachers/list', { params });
  }
  static getTeachers() {
    return $apiClient.get<TeacherDataModel>('/teachers');
  }

    static getTeacherCyclicSchedule() {
    return $apiClient.get<TeacherCyclicScheduleListType>('/teachers/schedules/cyclic');
  }
  static getTeacherNoCyclicSchedule() {
    return $apiClient.get<TeacherNoCyclicScheduleListType>('/teachers/schedules/no-cyclic');
  }
}
