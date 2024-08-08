import { ScheduleTypeEnum } from '@prisma/client';
import { NoneCyclicScheduleListDataModel } from '@/utils/models/none-cyclic.schedule';
import { GetCyclicDetailsType, ScheduleListDataModel } from '@/utils/models/schedule';
import { CreateEditNonCylicScheduleValidation } from '@/utils/validation/non-cyclic';
import {
  AddEditThematicPlanValidation,
  CreateEditScheduleValidation,
} from '@/utils/validation/schedule';
import $apiClient from '../axiosClient';
import { QueryParams } from '../types/common';

export class ScheduleService {
  static list(type: ScheduleTypeEnum, params?: QueryParams): Promise<ScheduleListDataModel> {
    return $apiClient.get<ScheduleListDataModel>('/schedules/list', {
      params: {
        ...params,
        type,
      },
    });
  }

  static createSchedule(
    data: CreateEditScheduleValidation | CreateEditNonCylicScheduleValidation,
    type: ScheduleTypeEnum,
  ) {
    return $apiClient.post('/schedules', data, {
      params: {
        type,
      },
    });
  }

  static updateSchedule(
    data: CreateEditScheduleValidation | CreateEditNonCylicScheduleValidation,
    type: ScheduleTypeEnum,
  ) {
    return $apiClient.patch(`/schedules/${data.id}`, data, {
      params: {
        type,
      },
    });
  }

  static deleteScheduleById(scheduleId: string) {
    return $apiClient.delete(`/schedules/${scheduleId}`);
  }

  static createThematicPlan(scheduleId: string, input: AddEditThematicPlanValidation) {
    return $apiClient.post(`/schedules/${scheduleId}/thematic-plan`, input);
  }

  static editThematicPlan(scheduleId: string, input: AddEditThematicPlanValidation) {
    return $apiClient.patch(`/schedules/${scheduleId}/thematic-plan`, input);
  }

  static getCyclicScheduleDetails(scheduleId: string): Promise<GetCyclicDetailsType> {
    return $apiClient.get<GetCyclicDetailsType>(`/schedules/${scheduleId}`);
  }

  // NONE-CYCLIC
  static noneCyclicList(params?: QueryParams): Promise<NoneCyclicScheduleListDataModel> {
    return $apiClient.get<NoneCyclicScheduleListDataModel>('/schedules/none-cyclic/list', {
      params,
    });
  }
}
