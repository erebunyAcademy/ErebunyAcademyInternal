import { Prisma } from '@prisma/client';
import { SubjectResolver } from '@/lib/prisma/resolvers/subject.resolver';

export type SubjectListModel = Awaited<ReturnType<typeof SubjectResolver.list>>['subjects'];

export type SubjectModel = SubjectListModel extends (infer SingleType)[] ? SingleType : never;

export type SubjectSignupListModel = Prisma.PromiseReturnType<typeof SubjectResolver.getSubjects>;

export type SubjectAdminListModel = Prisma.PromiseReturnType<typeof SubjectResolver.list>;
