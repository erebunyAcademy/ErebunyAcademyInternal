import { Course } from '@prisma/client';
import { NotFoundException } from 'next-api-decorators';
import { SortingType } from '@/api/types/common';
import { CreateEditCourseValidation } from '@/utils/validation/courses';
import { orderBy } from './utils/common';
import prisma from '..';

export class CourseResolver {
  static async list(skip: number, take: number, search: string, sorting: SortingType[]) {
    return Promise.all([
      prisma.course.count({
        where: {
          OR: [{ title: { contains: search, mode: 'insensitive' } }],
        },
      }),
      prisma.course.findMany({
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
          faculty: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: sorting ? orderBy(sorting) : undefined,
        skip,
        take,
      }),
    ]).then(([count, courses]) => ({
      count,
      courses,
    }));
  }

  static getCoursesList() {
    return prisma.course.findMany({
      select: {
        id: true,
        title: true,
        faculty: {
          select: {
            title: true,
          },
        },
      },
    });
  }

  static getCoursesListByFacultyId(facultyId: string) {
    return prisma.course.findMany({
      where: {
        facultyId,
      },
      select: {
        id: true,
        title: true,
      },
    });
  }

  static createCourse(data: CreateEditCourseValidation) {
    return prisma.course.create({ data });
  }

  static async getCourseById(id: string) {
    return prisma.course
      .findUnique({
        where: { id },
      })
      .then(res => {
        if (!res) {
          throw new NotFoundException('Student grade was not found');
        }
        return res;
      });
  }

  static async updateCourseById(gradIid: string, data: Partial<Course>) {
    const { id } = await this.getCourseById(gradIid);

    return prisma.course.update({
      where: {
        id,
      },
      data,
    });
  }

  static async deleteCourseById(gradeId: string) {
    // todo
    const { id } = await this.getCourseById(gradeId);
    return prisma.course.delete({
      where: {
        id,
      },
    });
  }
}
