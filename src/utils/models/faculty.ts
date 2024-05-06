import { Faculty, Prisma } from '@prisma/client';
import { FacultyResolver } from '@/lib/prisma/resolvers/faculty.resolver';

export interface FacultyModel extends Faculty {
}

export type FacultySignupListModel = Prisma.PromiseReturnType<typeof FacultyResolver.getFacultyList>;
export type FacultyAdminListModel = Prisma.PromiseReturnType<typeof FacultyResolver.list>;