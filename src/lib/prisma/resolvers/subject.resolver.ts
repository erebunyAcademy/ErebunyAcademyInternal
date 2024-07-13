import { NotFoundException } from 'next-api-decorators';
import { SortingType } from '@/api/types/common';
import { CreateEditSubjectValidation } from '@/utils/validation/subject';
import { orderBy } from './utils/common';
import prisma from '..';

export class SubjectResolver {
  static async list(skip: number, take: number, search: string, sorting: SortingType[]) {
    return Promise.all([
      prisma.subject.count({
        where: {
          OR: [{ title: { contains: search, mode: 'insensitive' } }],
        },
      }),
      prisma.subject.findMany({
        where: {
          OR: [{ title: { contains: search, mode: 'insensitive' } }],
        },
        select: {
          id: true,
          title: true,
          description: true,
          courseSubjects: {
            select: {
              course: {
                select: {
                  title: true,
                  id: true,
                },
              },
            },
          },
        },
        orderBy: sorting ? orderBy(sorting) : undefined,
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
      },
    });
  }

  static async createSubject(data: CreateEditSubjectValidation) {
    const createdSubject = await prisma.subject.create({
      data: {
        title: data.title,
        description: data.description,
      },
      select: {
        id: true,
      },
    });

    await prisma.courseSubject.create({
      data: {
        courseId: data.courseId,
        subjectId: createdSubject.id,
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

    const courseSubject = await prisma.courseSubject.findFirst({
      where: {
        subjectId: id,
      },
      select: {
        id: true,
      },
    });

    if (!courseSubject) {
      await prisma.courseSubject.create({
        data: {
          courseId: data.courseId,
          subjectId: id,
        },
      });
    } else {
      await prisma.courseSubject.update({
        where: {
          id: courseSubject.id,
        },
        data: {
          courseId: data.courseId,
        },
      });
    }

    return prisma.subject.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        description: data.description,
      },
    });
  }

  static async deleteSubjectById(subjectId: string) {
    // todo
    const { id } = await this.getSubjectById(subjectId);

    const courseSubject = await prisma.courseSubject.findFirst({
      where: {
        subjectId: id,
      },
      select: {
        id: true,
      },
    });

    if (courseSubject) {
      await prisma.courseSubject.delete({
        where: {
          id: courseSubject.id,
        },
      });
    }

    return prisma.subject.delete({
      where: {
        id,
      },
    });
  }
}
