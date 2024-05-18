import {
  Faculty,
  Prisma,
} from '../../../public/node_modules/.pnpm/@prisma+client@5.14.0_prisma@5.14.0/node_modules/@prisma/client/default';
import { FacultyResolver } from '@/lib/prisma/resolvers/faculty.resolver';

export interface FacultyModel extends Faculty {}

export type FacultySignupListModel = Prisma.PromiseReturnType<
  typeof FacultyResolver.getFacultyList
>;

export type FacultyAdminListModel = Prisma.PromiseReturnType<typeof FacultyResolver.list>;
