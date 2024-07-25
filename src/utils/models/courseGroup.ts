import { Prisma } from '@prisma/client';
import { CourseGroupResolver } from '@/lib/prisma/resolvers/course-group.resolver';

export type CourseGroupAdminListModel = Prisma.PromiseReturnType<typeof CourseGroupResolver.list>;
export type CourseGroupListModel = Awaited<
  ReturnType<typeof CourseGroupResolver.list>
>['courseGroups'];
export type CourseGroupSingleModel = CourseGroupListModel extends (infer SingleType)[]
  ? SingleType
  : never;

export type PublicCourseGroupListModel = Prisma.PromiseReturnType<
  typeof CourseGroupResolver.getCourseGroupList
>;

export type GetCourseGroupsBySubjectId = Prisma.PromiseReturnType<
  typeof CourseGroupResolver.getCourseGroupListBySubjectId
>;
