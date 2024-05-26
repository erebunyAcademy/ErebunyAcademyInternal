import {
  SubjectCategoryAdminListModel,
  SubjectCategorySignupListModel,
} from '@/utils/models/subjectCategory';
import { CreateEditSubjectCategoryValidation } from '@/utils/validation/subjectCategory';
import $apiClient from '../axiosClient';
import { QueryParams } from '../types/common';

type UpdateSubjectCategoryArgs = {
  data: CreateEditSubjectCategoryValidation;
  id: string;
};

export class SubjectCategoryService {
  static subjectCategoryList(params?: QueryParams) {
    return $apiClient.get<SubjectCategoryAdminListModel>('/subject-categories/list', { params });
  }
  static list(): Promise<SubjectCategorySignupListModel> {
    return $apiClient.get<SubjectCategorySignupListModel>('/subject-categories');
  }

  static createSubjectCategory(input: CreateEditSubjectCategoryValidation) {
    return $apiClient.post<CreateEditSubjectCategoryValidation>('/subject-categories', input);
  }
  static updateSubjectCategory(input: UpdateSubjectCategoryArgs) {
    const { id, data } = input;
    return $apiClient.patch<CreateEditSubjectCategoryValidation>(`/subject-categories/${id}`, data);
  }
  static deleteSubjectCategory(id: string) {
    return $apiClient.delete<CreateEditSubjectCategoryValidation>(`/subject-categories/${id}`);
  }

  static getSubjectCategoryBySubjectId(id: string) {
    return $apiClient.get(`/subject-categories/subject/${id}`);
  }
}
