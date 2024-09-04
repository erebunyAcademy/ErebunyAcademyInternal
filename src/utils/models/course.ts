import { Prisma } from '@prisma/client';
import { CourseResolver } from '@/lib/prisma/resolvers/course.resolver';

export type CourseListDataModel = Awaited<ReturnType<typeof CourseResolver.list>>;
export type CourseListModel = Awaited<ReturnType<typeof CourseResolver.list>>['courses'];

export type GetCoursesListModel = Prisma.PromiseReturnType<typeof CourseResolver.getCoursesList>;

export type CourseModel = CourseListModel extends (infer SingleType)[] ? SingleType : never;

export type StudentGradeAdminListModel = Prisma.PromiseReturnType<typeof CourseResolver.list>;

export type GetCoursesListByFacultyId = Prisma.PromiseReturnType<
  typeof CourseResolver.getCoursesListByFacultyId
>;
