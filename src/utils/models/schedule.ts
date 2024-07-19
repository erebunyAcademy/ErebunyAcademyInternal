import { Prisma } from '@prisma/client';
import { ScheduleResolver } from '@/lib/prisma/resolvers/schedule.resolver';

export type ScheduleListDataModel = Prisma.PromiseReturnType<typeof ScheduleResolver.list>;
export type ScheduleListModel = Awaited<ReturnType<typeof ScheduleResolver.list>>['schedules'];

export type ScheduleSingleModel = ScheduleListModel extends (infer SingleType)[]
  ? SingleType
  : never;
