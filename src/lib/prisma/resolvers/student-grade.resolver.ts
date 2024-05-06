import { StudentGrade, Subject } from '@prisma/client';
import { NotFoundException } from 'next-api-decorators';
import prisma from '..';

export class StudentGradeResolver {
  static createStudentGrade(data: Pick<StudentGrade, 'title' | 'description'>) {
    return prisma.studentGrade.create({ data });
  }

  static getStudentGradeById(id: string) {
    return prisma.studentGrade
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

  static getStudentGradeList() {
    return prisma.studentGrade.findMany({
      select: {
        id: true,
        title: true,
      },
    });
  }

  static async updateStudentGradeById(id: string, data: Partial<Subject>) {
    const subject = await this.getStudentGradeById(id);

    return prisma.studentGrade.update({
      where: {
        id: subject.id,
      },
      data,
    });
  }

  static async deleteStudentGradeById(id: string) {
    const subject = await this.getStudentGradeById(id);
    return prisma.studentGrade.delete({
      where: {
        id: subject.id,
      },
    });
  }
}
