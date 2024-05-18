import {
  Prisma,
  StudentGrade,
} from '../../../public/node_modules/.pnpm/@prisma+client@5.14.0_prisma@5.14.0/node_modules/@prisma/client/default';
import { StudentGradeResolver } from '@/lib/prisma/resolvers/student-grade.resolver';

export interface StudentGradeModel extends StudentGrade {}

export type StudentGradeSignupListModel = Prisma.PromiseReturnType<
  typeof StudentGradeResolver.getStudentGradeList
>;

export type StudentGradeAdminListModel = Prisma.PromiseReturnType<typeof StudentGradeResolver.list>;
