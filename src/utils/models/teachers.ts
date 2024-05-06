import { Prisma } from '@prisma/client';
import { TeacherResolver } from '@/lib/prisma/resolvers/teacher.resolver';

export type TeachersListModel = Prisma.PromiseReturnType<typeof TeacherResolver.list>;
