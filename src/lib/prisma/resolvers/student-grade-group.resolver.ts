import { StudentGradeGroup, Subject } from '@prisma/client';
import { NotFoundException } from 'next-api-decorators';
import { SortingType } from '@/api/types/common';
import { orderBy } from './utils/common';
import prisma from '..';

export class StudentGradeGroupResolver {
  static async list(skip: number, take: number, search: string, sorting: SortingType[]) {
    return Promise.all([
      prisma.studentGradeGroup.count({
        where: {
          OR: [{ title: { contains: search, mode: 'insensitive' } }],
        },
      }),
      prisma.studentGradeGroup.findMany({
        where: {
          OR: [{ title: { contains: search, mode: 'insensitive' } }],
        },
        select: { id: true, title: true, description: true, createdAt: true },
        orderBy: sorting ? orderBy(sorting) : undefined,
        skip,
        take,
      }),
    ]).then(([count, studentGradeGroups]) => ({
      count,
      studentGradeGroups,
    }));
  }
  static createStudentGradeGroup(data: Pick<StudentGradeGroup, 'title' | 'description'>) {
    return prisma.studentGradeGroup.create({ data });
  }

  static getStudentGradeGroupById(id: string) {
    return prisma.studentGradeGroup
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

  static getStudentGradeGroupList() {
    return prisma.studentGradeGroup.findMany({
      select: {
        id: true,
        title: true,
      },
    });
  }

  static async updateStudentGradeGroupById(id: string, data: Partial<Subject>) {
    const subject = await this.getStudentGradeGroupById(id);

    return prisma.studentGradeGroup.update({
      where: {
        id: subject.id,
      },
      data,
    });
  }

  static async deleteStudentGradeGroupById(id: string) {
    const subject = await this.getStudentGradeGroupById(id);
    return prisma.studentGradeGroup.delete({
      where: {
        id: subject.id,
      },
    });
  }
}
