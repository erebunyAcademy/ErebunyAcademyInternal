import {
  Exam,
  Prisma,
} from '../../../public/node_modules/.pnpm/@prisma+client@5.14.0_prisma@5.14.0/node_modules/@prisma/client/default';
import { ExamsResolver } from '@/lib/prisma/resolvers/exam.resolver';

export type ExamListModel = Prisma.PromiseReturnType<typeof ExamsResolver.list>;
export type ExamDataListModel = Prisma.PromiseReturnType<typeof ExamsResolver.getExamDataById>;
export interface FacultyModel extends Exam {}
