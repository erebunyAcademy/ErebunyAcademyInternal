import { Prisma } from '@prisma/client';
import { StudentResolver } from '@/lib/prisma/resolvers/student.resolver';

export type StudentsListModel = Prisma.PromiseReturnType<typeof StudentResolver.list>;

export type StudentListModel = Awaited<ReturnType<typeof StudentResolver.list>>['users'];

export type StudentModel = StudentListModel extends (infer SingleType)[] ? SingleType : never;

export type UserStudentModel = Prisma.PromiseReturnType<
  typeof StudentResolver.getStudentsByCourseGroupId
>;

export type StudentExams = Prisma.PromiseReturnType<typeof StudentResolver.getStudentExams>;

export type StudentExam = StudentExams extends (infer SingleType)[] ? SingleType : never;

export type ExamParticipantsListModel = Prisma.PromiseReturnType<
  typeof StudentResolver.getStudentsInfoByExamId
>;
