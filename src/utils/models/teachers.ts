import { Prisma, Teacher, User } from '@prisma/client';
import { TeacherResolver } from '@/lib/prisma/resolvers/teacher.resolver';

export type TeachersListModel = Prisma.PromiseReturnType<typeof TeacherResolver.list>;

export type TeacherDataModel = Prisma.PromiseReturnType<typeof TeacherResolver.getTeachers>;
export interface TeacherModel extends User {
  teacher: Teacher;
}


export type TeacherCyclicScheduleListType = Prisma.PromiseReturnType<
  typeof TeacherResolver.getTeacherCyclicSchedule
>;

export type TeacherScheduleListSingleType = TeacherCyclicScheduleListType extends (infer SingleType)[]
  ? SingleType
  : never;


export type TeacherNoCyclicScheduleListType = Prisma.PromiseReturnType<
  typeof TeacherResolver.getTeacherNonCyclicSchedule
>;

export type TeacherNoCyclicScheduleListSingleType = TeacherNoCyclicScheduleListType extends (infer SingleType)[]
  ? SingleType
  : never;


