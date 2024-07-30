import { StudentCyclicScheduleListType, StudentNoCyclicScheduleListType, } from '@/utils/models/schedule';
import { StudentExams, StudentsListModel, UserStudentModel } from '@/utils/models/student';
import { UpdateStudentValidation } from '@/utils/validation/student';
import $apiClient from '../axiosClient';
import { QueryParams } from '../types/common';

export class StudentService {
  static list(params: QueryParams) {
    return $apiClient.get<StudentsListModel>('/students/list', { params });
  }
  static getStudentsByCourseGroupId(id: string) {
    return $apiClient.get<UserStudentModel>(`/students/course-group/${id}`);
  }
  static getStudentExams() {
    return $apiClient.get<StudentExams>('/students/exams');
  }
  static updateStudentData(input: UpdateStudentValidation, studentId: string) {
    return $apiClient.patch(`/students/${studentId}`, input);
  }

  static getStudentsByExamId(examId: string) {
    return $apiClient.get(`/students/exams/${examId}`);
  }

  static getStudentCyclicSchedule() {
    return $apiClient.get<StudentCyclicScheduleListType>('/students/schedules/cyclic');
  }
  static getStudentNoCyclicSchedule() {
    return $apiClient.get<StudentNoCyclicScheduleListType>('/students/schedules/no-cyclic');
  }
}
