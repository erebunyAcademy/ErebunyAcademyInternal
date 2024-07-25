import { Prisma } from '@prisma/client';
import { ScheduleResolver } from '@/lib/prisma/resolvers/schedule.resolver';

export type NoneCyclicScheduleListDataModel = Prisma.PromiseReturnType<
  typeof ScheduleResolver.nonCycleSchedulelist
>;

export type NoneCyclicScheduleListModel = Awaited<
  ReturnType<typeof ScheduleResolver.nonCycleSchedulelist>
>['schedules'];

export type NoneCyclicScheduleSingleModel = NoneCyclicScheduleListModel extends (infer SingleType)[]
  ? SingleType
  : never;
