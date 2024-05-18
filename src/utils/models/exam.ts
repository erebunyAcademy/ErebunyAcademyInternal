
import { ExamsResolver } from '@/lib/prisma/resolvers/exam.resolver';
import { Exam, Prisma } from '@prisma/client';

export type ExamListModel = Prisma.PromiseReturnType<typeof ExamsResolver.list>;
export type ExamDataListModel = Prisma.PromiseReturnType<typeof ExamsResolver.getExamDataById>;
export interface FacultyModel extends Exam {}
