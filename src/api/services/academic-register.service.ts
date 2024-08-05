import { GetScheduleDataType } from '@/utils/models/academic-register';
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
    courseGroupId: string,
    lessonOfTheDay: string,
  ) {
    return $apiClient.post(`/academic-registers/${courseGroupId}`, input, {
      params: {
        lessonOfTheDay,
      },
    });
  }
}
