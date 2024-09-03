import { ScheduleTypeEnum } from '@prisma/client';
import { SortingState } from '@tanstack/react-table';
import { GetScheduleByIdModel, ScheduleListDataModel } from '@/utils/models/schedule';
import { CreateEditNonCyclicScheduleValidation } from '@/utils/validation/non-cyclic';
import {
  AddEditThematicPlanValidation,
  CreateEditScheduleValidation,
  TeacherAttachmentModalValidation,
} from '@/utils/validation/schedule';
import $apiClient from '../axiosClient';
import { QueryParams } from '../types/common';

export class ScheduleService {
  static list(
    type: ScheduleTypeEnum,
    params: QueryParams,
    sorting: SortingState,
  ): Promise<ScheduleListDataModel> {
    return $apiClient.get<ScheduleListDataModel>('/schedules/list', {
      params: {
        ...params,
        type,
        ...(sorting.length > 0
          ? {
              sortBy: sorting[0].id,
              sortDir: sorting[0].desc ? 'desc' : 'asc',
            }
          : {}),
      },
    });
  }

  static createSchedule(
    data: CreateEditScheduleValidation | CreateEditNonCyclicScheduleValidation,
    type: ScheduleTypeEnum,
  ) {
    return $apiClient.post('/schedules', data, {
      params: {
        type,
      },
    });
  }

  static updateSchedule(
    data: CreateEditScheduleValidation | CreateEditNonCyclicScheduleValidation,
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

  static getScheduleById(scheduleId: string): Promise<GetScheduleByIdModel> {
    return $apiClient.get<GetScheduleByIdModel>(`/schedules/${scheduleId}`);
  }

  static updateScheduleAttachments(scheduleId: string, input: TeacherAttachmentModalValidation) {
    return $apiClient.patch(`/schedules/${scheduleId}/attachments`, input);
  }
}
