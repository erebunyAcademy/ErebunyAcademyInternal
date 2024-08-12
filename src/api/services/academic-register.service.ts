import {
  GetScheduleDataType,
  GetStudentAcademicRegisterModel,
} from '@/utils/models/academic-register';
import { CourseGroupAdminListModel } from '@/utils/models/courseGroup';
import { CreateStudentAttentdanceRecordValidation } from '@/utils/validation/academic-register';
import $apiClient from '../axiosClient';

export class AcademicRegisterService {
  static list(): Promise<GetScheduleDataType> {
    return $apiClient.get<GetScheduleDataType>('/academic-registers/list');
  }
  static getNonCyclicRegisterList() {
    return $apiClient.get<CourseGroupAdminListModel>('/academic-registers/cyclic-list');
  }

  static createStudentMark(
    input: CreateStudentAttentdanceRecordValidation,
    scheduleId: string,
    lessonOfTheDay: string,
    academicRegisterId?: string,
  ) {
    return $apiClient.post(`/academic-registers/schedules/${scheduleId}`, input, {
      params: {
        lessonOfTheDay,
        academicRegisterId,
      },
    });
  }

  static getAcademicRegisterData(
    params: {
      startDate: Date;
      endDate: Date;
    } | null,
  ): Promise<GetStudentAcademicRegisterModel> {
    return $apiClient.get<GetStudentAcademicRegisterModel>(`/academic-registers`, {
      params: params ?? {},
    });
  }
}
