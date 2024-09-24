import { NotFoundException } from 'next-api-decorators';
import { User } from 'next-auth';
import { SortingType } from '@/api/types/common';
import { CreateEditSubjectValidation } from '@/utils/validation/subject';
import prisma from '..';
import { orderBy } from './utils/common';

export class SubjectResolver {
  static async list(
    user: NonNullable<User>,
    skip: number,
    take: number,
    search: string,
    sorting: SortingType[],
  ) {
    return Promise.all([
      prisma.subject.count({
        where: {
          OR: [{ title: { contains: search, mode: 'insensitive' } }],
          ...(user.teacher?.id
            ? {
                subjectTeacher: {
                  some: {
                    teacherId: user.teacher?.id,
                  },
                },
              }
            : {}),
        },
      }),
      prisma.subject.findMany({
        where: {
          OR: [{ title: { contains: search, mode: 'insensitive' } }],
          ...(user.teacher?.id
            ? {
                subjectTeacher: {
                  some: {
                    teacherId: user.teacher?.id,
                  },
                },
              }
            : {}),
        },
        select: {
          id: true,
          title: true,
          description: true,
          course: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: sorting ? orderBy(sorting) : { title: 'asc' },
        skip,
        take,
      }),
    ]).then(([count, subjects]) => ({
      count,
      subjects,
    }));
  }

  static getSubjects() {
    return prisma.subject.findMany({
      select: {
        id: true,
        title: true,
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  static async createSubject(data: CreateEditSubjectValidation) {
    const createdSubject = await prisma.subject.create({
      data: {
        title: data.title,
        description: data.description,
        courseId: data.courseId,
      },
      select: {
        id: true,
      },
    });

    return createdSubject;
  }

  static getSubjectById(id: string) {
    return prisma.subject
      .findUnique({
        where: { id },
      })
      .then(res => {
        if (!res) {
          throw new NotFoundException('Subject was not found');
        }
        return res;
      });
  }

  static async updateSubjectById(subjectId: string, data: CreateEditSubjectValidation) {
    const { id } = await this.getSubjectById(subjectId);

    return prisma.subject.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        courseId: data.courseId,
        description: data.description,
      },
    });
  }

  static async deleteSubjectById(subjectId: string) {
    const { id } = await this.getSubjectById(subjectId);

    return prisma.subject.delete({
      where: {
        id,
      },
    });
  }
}
