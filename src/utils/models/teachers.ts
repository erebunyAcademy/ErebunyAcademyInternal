import {
  Prisma,
  Teacher,
} from '../../../public/node_modules/.pnpm/@prisma+client@5.14.0_prisma@5.14.0/node_modules/@prisma/client/default';
import { User } from '../../../public/node_modules/.pnpm/@prisma+client@5.14.0_prisma@5.14.0/node_modules/@prisma/client/default';
import { TeacherResolver } from '@/lib/prisma/resolvers/teacher.resolver';

export type TeachersListModel = Prisma.PromiseReturnType<typeof TeacherResolver.list>;

export interface TeacherModel extends User {
  teacher: Teacher;
}
