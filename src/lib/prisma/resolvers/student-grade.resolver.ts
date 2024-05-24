import { StudentGrade } from '@prisma/client';
import { NotFoundException } from 'next-api-decorators';
import { SortingType } from '@/api/types/common';
import { orderBy } from './utils/common';
import prisma from '..';

export class StudentGradeResolver {
  static async list(skip: number, take: number, search: string, sorting: SortingType[]) {
    return Promise.all([
      prisma.studentGrade.count({
        where: {
          OR: [{ title: { contains: search, mode: 'insensitive' } }],
        },
      }),
      prisma.studentGrade.findMany({
        where: {
          OR: [{ title: { contains: search, mode: 'insensitive' } }],
        },
        select: { id: true, title: true, description: true, facultyId: true },
        orderBy: sorting ? orderBy(sorting) : undefined,
        skip,
        take,
      }),
    ]).then(([count, studentGrades]) => ({
      count,
      studentGrades,
    }));
  }

  static getStudentGradeList() {
    return prisma.studentGrade.findMany({
      select: {
        id: true,
        title: true,
      },
    });
  }

  static getStudentGradeListByFacultyId(facultyId: string) {
    return prisma.studentGrade.findMany({
      where: {
        facultyId,
      },
      select: {
        id: true,
        title: true,
      },
    });
  }

  static createStudentGrade(data: Pick<StudentGrade, 'title' | 'description'>) {
    return prisma.studentGrade.create({ data });
  }

  static async getStudentGradeById(id: string) {
    return prisma.studentGrade
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

  static async updateStudentGradeById(gradIid: string, data: Partial<StudentGrade>) {
    const { id } = await this.getStudentGradeById(gradIid);

    return prisma.studentGrade.update({
      where: {
        id,
      },
      data,
    });
  }

  static async deleteStudentGradeById(gradeId: string) {
    // todo
    const { id } = await this.getStudentGradeById(gradeId);
    return prisma.studentGrade.delete({
      where: {
        id,
      },
    });
  }
}
