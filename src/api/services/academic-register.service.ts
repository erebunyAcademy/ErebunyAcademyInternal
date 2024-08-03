import { CyclicAcademicRegisterList } from '@/utils/models/academic-register';
import { CourseGroupAdminListModel } from '@/utils/models/courseGroup';
import $apiClient from '../axiosClient';

export class AcademicRegisterService {
  static getCyclicRegisterList(): Promise<CyclicAcademicRegisterList> {
    return $apiClient.get<CyclicAcademicRegisterList>('/academic-registers/cyclic-list');
  }
  static getNonCyclicRegisterList() {
    return $apiClient.get<CourseGroupAdminListModel>('/academic-registers/cyclic-list');
  }
}
