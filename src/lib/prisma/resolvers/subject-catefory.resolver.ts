import { Subject } from '@prisma/client';
import { NotFoundException } from 'next-api-decorators';
import { SortingType } from '@/api/types/common';
import { orderBy } from './utils/common';
import prisma from '..';

export class SubjectResolver {
  static async list(skip: number, take: number, search: string, sorting: SortingType[]) {
    return Promise.all([
      prisma.subjectCategory.count({
        where: {
          OR: [{ title: { contains: search, mode: 'insensitive' } }],
        },
      }),
      prisma.subject.findMany({
        where: {
          OR: [{ title: { contains: search, mode: 'insensitive' } }],
        },
        select: { id: true, title: true, description: true },
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

  static createSubject(data: Pick<Subject, 'title' | 'description'>) {
    return prisma.subject.create({ data });
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

  static async updateSubjectById(subjectId: string, data: Partial<Subject>) {
    const { id } = await this.getSubjectById(subjectId);

    return prisma.subject.update({
      where: {
        id,
      },
      data,
    });
  }

  static async deleteSubjectById(subjectId: string) {
    // todo
    const { id } = await this.getSubjectById(subjectId);
    return prisma.subject.delete({
      where: {
        id,
      },
    });
  }
}
