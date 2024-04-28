import { Exam } from '@prisma/client';
import { NotFoundException } from 'next-api-decorators';
import prisma from '..';

export class ExamResolver {
  static async createExam(data: Pick<Exam, 'title' | 'description'>) {
    return prisma.exam.create({ data });
  }

  static async getExamById(id: number) {
    return prisma.exam
      .findUnique({
        where: { id },
      })
      .then(res => {
        if (!res) {
          throw new NotFoundException('Exam was not found');
        }
        return res;
      });
  }

  static async getExamList() {
    return prisma.exam.findMany();
  }

  static async updateExamById(examId: number, data: Partial<Exam>) {
    const { id } = await this.getExamById(examId);

    return prisma.exam.update({
      where: {
        id,
      },
      data,
    });
  }

  static async deleteStudentGradeById(examId: number) {
    const { id } = await this.getExamById(examId);
    return prisma.studentGrade.delete({
      where: {
        id,
      },
    });
  }
}
