import { SubjectResolver } from '@/lib/prisma/resolvers/subject.resolver';
import { Prisma, Subject } from '@prisma/client';

export interface SubjectModel extends Subject {}

export type SubjectSignupListModel = Prisma.PromiseReturnType<typeof SubjectResolver.getSubjects>;

export type SubjectAdminListModel = Prisma.PromiseReturnType<typeof SubjectResolver.list>;
