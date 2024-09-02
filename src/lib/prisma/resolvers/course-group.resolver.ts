import { NotFoundException } from 'next-api-decorators';
import { SortingType } from '@/api/types/common';
import { CreateEditCourseGroupValidation } from '@/utils/validation/courseGroup';
import { orderBy } from './utils/common';
import prisma from '..';

export class CourseGroupResolver {
  static async list(skip: number, take: number, search: string, sorting: SortingType[]) {
    return Promise.all([
      prisma.courseGroup.count({
        where: {
          OR: [{ title: { contains: search, mode: 'insensitive' } }],
        },
      }),
      prisma.courseGroup.findMany({
        where: {
          OR: [{ title: { contains: search, mode: 'insensitive' } }],
        },
        select: {
          id: true,
          title: true,
          description: true,
          gradeLevel: {
            select: {
              id: true,
              level: true,
            },
          },
          course: {
            select: {
              id: true,
              title: true,
              faculty: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
        orderBy: sorting ? orderBy(sorting) : undefined,
        skip,
        take,
      }),
    ]).then(([count, courseGroups]) => ({
      count,
      courseGroups,
    }));
  }

  static getCourseGroupList() {
    return prisma.courseGroup.findMany({
      select: {
        id: true,
        title: true,
      },
    });
  }

  static getCourseGroupListByCourseId(courseId: string) {
    return prisma.courseGroup.findMany({
      where: {
        courseId,
      },
      select: {
        id: true,
        title: true,
      },
    });
  }

  static createCourseGroup(data: CreateEditCourseGroupValidation) {
    return prisma.courseGroup.create({ data });
  }

  static async getCourseGroupById(id: string) {
    return prisma.courseGroup
      .findUnique({
        where: { id },
      })
      .then(res => {
        if (!res) {
          throw new NotFoundException('Student grade group was not found');
        }
        return res;
      });
  }

  static async updateCourseGroupById(
    studentGradeGroupId: string,
    data: CreateEditCourseGroupValidation,
  ) {
    const { id } = await this.getCourseGroupById(studentGradeGroupId);

    return prisma.courseGroup.update({
      where: {
        id,
      },
      data,
    });
  }

  static async deleteCourseGroupById(studentGradeGroupId: string) {
    const { id } = await this.getCourseGroupById(studentGradeGroupId);
    return prisma.courseGroup.delete({
      where: {
        id,
      },
    });
  }

  static async getCourseGroupListBySubjectId(subjectId: string) {
    return prisma.subject.findUniqueOrThrow({
      where: {
        id: subjectId,
      },
      select: {
        course: {
          select: {
            groups: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });
  }
}
