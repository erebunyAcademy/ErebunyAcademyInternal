import { Prisma } from '@prisma/client';
import { ScheduleResolver } from '@/lib/prisma/resolvers/schedule.resolver';
import { StudentResolver } from '@/lib/prisma/resolvers/student.resolver';

export type ScheduleListDataModel = Prisma.PromiseReturnType<typeof ScheduleResolver.list>;

export type ScheduleListModel = Awaited<ReturnType<typeof ScheduleResolver.list>>['schedules'];

export type ScheduleSingleModel = ScheduleListModel extends (infer SingleType)[]
  ? SingleType
  : never;

export type StudentCyclicScheduleListType = Prisma.PromiseReturnType<
  typeof StudentResolver.getStudentCyclicSchedule
>;

export type StudentScheduleListSingleType =
  StudentCyclicScheduleListType extends (infer SingleType)[] ? SingleType : never;

export type StudentNoCyclicScheduleListType = Prisma.PromiseReturnType<
  typeof StudentResolver.getStudentCyclicSchedule
>;

export type StudentNoCyclicScheduleListSingleType =
  StudentNoCyclicScheduleListType extends (infer SingleType)[] ? SingleType : never;

export type GetScheduleByIdModel = Prisma.PromiseReturnType<
  typeof ScheduleResolver.getScheduleById
>;
