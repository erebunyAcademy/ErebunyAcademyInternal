import { GradeLevelTypeEnum } from '@prisma/client';
import { GradeLevelListType } from '@/utils/models/grade-levels';
import $apiClient from '../axiosClient';

export class GradeLevelService {
  static list(type?: GradeLevelTypeEnum) {
    return $apiClient.get<GradeLevelListType>('/grade-levels/list', { params: { type } });
  }
}
