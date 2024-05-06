import { Exam } from '@prisma/client';
import { NotFoundException } from 'next-api-decorators';
import prisma from '..';

export class ExamsResolver {
  static async createExam() {
    return prisma.exam.create({ data: { title: '' }, select: { id: true } });
  }

  static async getExamById(id: string) {
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

  static async updateExamById(examId: string, data: Partial<Exam>) {
    const { id } = await this.getExamById(examId);

    return prisma.exam.update({
      where: {
        id,
      },
      data,
    });
  }

  static async deleteStudentGradeById(examId: string) {
    const { id } = await this.getExamById(examId);
    return prisma.studentGrade.delete({
      where: {
        id,
      },
    });
  }
}
