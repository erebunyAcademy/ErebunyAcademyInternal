import {
  Prisma,
  StudentGradeGroup,
} from '../../../public/node_modules/.pnpm/@prisma+client@5.14.0_prisma@5.14.0/node_modules/@prisma/client/default';
import { StudentGradeGroupResolver } from '@/lib/prisma/resolvers/student-grade-group.resolver';

export interface StudentGradeGroupModel extends StudentGradeGroup {}

export type StudentGradeGroupSignupListModel = Prisma.PromiseReturnType<
  typeof StudentGradeGroupResolver.getStudentGradeGroupList
>;

export type StudentGradeGroupAdminListModel = Prisma.PromiseReturnType<
  typeof StudentGradeGroupResolver.list
>;
