import { Prisma } from '@prisma/client';
import { StudentResolver } from '@/lib/prisma/resolvers/student.resolver';

export type StudentsListModel = Prisma.PromiseReturnType<typeof StudentResolver.list>;
