import { TeacherResolver } from '@/lib/prisma/resolvers/teacher.resolver';
import { Prisma, Teacher, User } from '@prisma/client';

export type TeachersListModel = Prisma.PromiseReturnType<typeof TeacherResolver.list>;

export interface TeacherModel extends User {
  teacher: Teacher;
}
