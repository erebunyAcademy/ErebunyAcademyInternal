import { Prisma } from '@prisma/client';
import { ExamsResolver } from '@/lib/prisma/resolvers/exam.resolver';
import { TestQuestionResolver } from '@/lib/prisma/resolvers/test-question.resolver';

export type TestQuestionListModel = Prisma.PromiseReturnType<
  typeof TestQuestionResolver.getTestQuestionsBySubjectId
>;

export type TestQuestion = TestQuestionListModel extends (infer SingleType)[] ? SingleType : never;

export type StudentAnswerMutationModel = Prisma.PromiseReturnType<
  typeof ExamsResolver.createStudentAnswer
>;
