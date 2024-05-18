import { StudentGradeResolver } from '@/lib/prisma/resolvers/student-grade.resolver';
import { Prisma, StudentGrade } from '@prisma/client';

export interface StudentGradeModel extends StudentGrade {}

export type StudentGradeSignupListModel = Prisma.PromiseReturnType<
  typeof StudentGradeResolver.getStudentGradeList
>;

export type StudentGradeAdminListModel = Prisma.PromiseReturnType<typeof StudentGradeResolver.list>;
