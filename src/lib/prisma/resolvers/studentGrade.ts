import { NotFoundException } from 'next-api-decorators';
import prisma from '..';
import { StudentGrade, Subject } from '@prisma/client';

export class StudentGradeResolver {
  static createStudentGrade(data: Pick<StudentGrade, 'title' | 'description'>) {
    return prisma.subject.create({ data });
  }

  static getStudentGradeById(id: number) {
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
    return prisma.studentGrade.findMany();
  }

  static async updateStudentGradeById(id: number, data: Partial<Subject>) {
    const subject = await this.getStudentGradeById(id);

    return prisma.studentGrade.update({
      where: {
        id: subject.id,
      },
      data,
    });
  }

  static async deleteStudentGradeById(id: number) {
    const subject = await this.getStudentGradeById(id);
    return prisma.studentGrade.delete({
      where: {
        id: subject.id,
      },
    });
  }
}
