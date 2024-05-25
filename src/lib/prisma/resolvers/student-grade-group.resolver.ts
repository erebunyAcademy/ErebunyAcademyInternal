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
        select: { id: true, title: true, description: true, studentGradeId: true },
        orderBy: sorting ? orderBy(sorting) : undefined,
        skip,
        take,
      }),
    ]).then(([count, studentGradeGroups]) => ({
      count,
      studentGradeGroups,
    }));
  }

  static getStudentGradeGroupList() {
    return prisma.studentGradeGroup.findMany({
      select: {
        id: true,
        title: true,
      },
    });
  }

  static getStudentGradeGroupListByStudentGradeId(studentGradeId: string) {
    return prisma.studentGradeGroup.findMany({
      where: {
        studentGradeId,
      },
      select: {
        id: true,
        title: true,
      },
    });
  }

  static createStudentGradeGroup(data: Pick<StudentGradeGroup, 'title' | 'description'>) {
    return prisma.studentGradeGroup.create({ data });
  }

  static async getStudentGradeGroupById(id: string) {
    return prisma.studentGradeGroup
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

  static async updateStudentGradeGroupById(studentGradeGroupId: string, data: Partial<Subject>) {
    const { id } = await this.getStudentGradeGroupById(studentGradeGroupId);

    return prisma.studentGradeGroup.update({
      where: {
        id,
      },
      data,
    });
  }

  static async deleteStudentGradeGroupById(studentGradeGroupId: string) {
    // todo
    const { id } = await this.getStudentGradeGroupById(studentGradeGroupId);
    return prisma.studentGradeGroup.delete({
      where: {
        id,
      },
    });
  }
}
