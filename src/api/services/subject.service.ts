import { SubjectAdminListModel, SubjectSignupListModel } from '@/utils/models/subject';
import { CreateEditSubjectValidation } from '@/utils/validation/subject';
import $apiClient from '../axiosClient';
import { QueryParams } from '../types/common';

export class SubjectService {
  static subjectList(params?: QueryParams) {
    return $apiClient.get<SubjectAdminListModel>('/subjects/list', { params });
  }

  static list() {
    return $apiClient.get<SubjectSignupListModel>('/subjects');
  }

  static createSubject(input: CreateEditSubjectValidation) {
    return $apiClient.post<CreateEditSubjectValidation>('/subjects', input);
  }
  static updateSubject(input: CreateEditSubjectValidation) {
    return $apiClient.patch<CreateEditSubjectValidation>(`/subjects/${input.id}`, input);
  }
  static deleteSubject(id: string) {
    return $apiClient.delete<CreateEditSubjectValidation>(`/subjects/${id}`);
  }
}
