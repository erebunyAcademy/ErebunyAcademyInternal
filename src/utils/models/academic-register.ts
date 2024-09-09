import { Prisma, ThematicPlan, ThematicPlanDescription } from '@prisma/client';
import { AcademicRegisterResolver } from '@/lib/prisma/resolvers/academic-register.resolver';

export type GetScheduleDataType = Prisma.PromiseReturnType<typeof AcademicRegisterResolver.list>;
export type GetAcademicRegisterType = Prisma.PromiseReturnType<
  typeof AcademicRegisterResolver.getAcademicRegister
>;

export type GetScheduleByIdType = Prisma.PromiseReturnType<
  typeof AcademicRegisterResolver.getScheduleRecordById
>;

export type GetStudentAcademicRegisterModel = Prisma.PromiseReturnType<
  typeof AcademicRegisterResolver.getStudentAcademicRegisterdata
>;

export interface ThematicPlanDataModel extends ThematicPlan {
  thematicPlanDescription: ThematicPlanDescription[];
}

export type GetAcademicRegisterLessonListType = Prisma.PromiseReturnType<
  typeof AcademicRegisterResolver.getTeacherAcademicRegisterLessonList
>;

export type StudentAcademicRegisterDataType = Prisma.PromiseReturnType<
  typeof AcademicRegisterResolver.getAcademicRegisterByCourseGroupId
>;
