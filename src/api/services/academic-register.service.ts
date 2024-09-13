import {
  GetAcademicRegisterLessonListType,
  GetScheduleDataType,
  GetStudentAcademicRegisterModel,
  StudentAcademicRegisterDataType,
} from '@/utils/models/academic-register';
import { CourseGroupAdminListModel } from '@/utils/models/courseGroup';
import {
  CreateStudentAttendanceRecordValidation,
  UpdateStudentAttendanceRecordsValidation,
} from '@/utils/validation/academic-register';
import $apiClient from '../axiosClient';

export class AcademicRegisterService {
  static list(): Promise<GetScheduleDataType> {
    return $apiClient.get<GetScheduleDataType>('/academic-registers/list');
  }
  static getNonCyclicRegisterList() {
    return $apiClient.get<CourseGroupAdminListModel>('/academic-registers/cyclic-list');
  }

  static createStudentMark(
    input: CreateStudentAttendanceRecordValidation,
    scheduleId: string,
    lessonOfTheDay: string,
    academicRegisterId?: string,
  ): Promise<boolean> {
    return $apiClient.post<boolean>(`/academic-registers/schedules/${scheduleId}`, input, {
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

  static getTeacherAcademicRegisterLessonList(scheduleId: string) {
    return $apiClient.get<GetAcademicRegisterLessonListType>(
      `/academic-registers/${scheduleId}/lessons`,
    );
  }

  static getCourseGroupAcademicRegister(
    courseGroupId: string,
    params?: {
      startDate: Date;
      endDate: Date;
    } | null,
  ): Promise<StudentAcademicRegisterDataType> {
    return $apiClient.get<StudentAcademicRegisterDataType>(
      `/academic-registers/course-groups/${courseGroupId}`,
      {
        params: params ?? {},
      },
    );
  }

  static updateAttendantRecords(input: UpdateStudentAttendanceRecordsValidation) {
    return $apiClient.put(`/academic-registers/attendant-records`, input);
  }
}
