import { Prisma } from '@prisma/client';
import { AcademicRegisterResolver } from '@/lib/prisma/resolvers/academic-register.resolver';

export type GetScheduleDataType = Prisma.PromiseReturnType<typeof AcademicRegisterResolver.list>;
export type GetAcademicRegisterType = Prisma.PromiseReturnType<
  typeof AcademicRegisterResolver.getAcademicRegister
>;

export type GetScheduleByIdType = Prisma.PromiseReturnType<
  typeof AcademicRegisterResolver.getScheduleRecordById
>;

export type GetStudentAcademicRegisterModel = Prisma.PromiseReturnType<
  typeof AcademicRegisterResolver.getStudentAcademicRegisterData
>;
