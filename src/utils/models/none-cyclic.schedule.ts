import { Prisma } from '@prisma/client';
import { ScheduleResolver } from '@/lib/prisma/resolvers/schedule.resolver';

export type NoneCyclicScheduleListDataModel = Prisma.PromiseReturnType<
  typeof ScheduleResolver.nonCycleScheduleList
>;

export type NoneCyclicScheduleListModel = Awaited<
  ReturnType<typeof ScheduleResolver.nonCycleScheduleList>
>['schedules'];

export type NoneCyclicScheduleSingleModel = NoneCyclicScheduleListModel extends (infer SingleType)[]
  ? SingleType
  : never;

export type GetNoCyclicDetailsType = Prisma.PromiseReturnType<
  typeof ScheduleResolver.getNoCyclicSchedule
>;
