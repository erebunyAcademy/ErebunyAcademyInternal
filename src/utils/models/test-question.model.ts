import { Prisma } from '@prisma/client';
import { TestQuestionResolver } from '@/lib/prisma/resolvers/test-question.resolver';

export type TestQuestionListModel = Prisma.PromiseReturnType<
  typeof TestQuestionResolver.getTestQuestionsBySubjectId
>;
