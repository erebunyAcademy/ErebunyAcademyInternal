import {
  Prisma,
  Subject,
} from '../../../public/node_modules/.pnpm/@prisma+client@5.14.0_prisma@5.14.0/node_modules/@prisma/client/default';
import { SubjectResolver } from '@/lib/prisma/resolvers/subject.resolver';

export interface SubjectModel extends Subject {}

export type SubjectSignupListModel = Prisma.PromiseReturnType<typeof SubjectResolver.getSubjects>;

export type SubjectAdminListModel = Prisma.PromiseReturnType<typeof SubjectResolver.list>;
