import { Exam } from '@prisma/client';
import { NotFoundException } from 'next-api-decorators';
import { SortingType } from '@/api/types/common';
import { ExamValidation } from '@/utils/validation/exam';
import { orderBy } from './utils/common';
import prisma from '..';

export class ExamsResolver {
  static async list(skip: number, take: number, search: string, sorting: SortingType[]) {
    return Promise.all([
      prisma.exam.count({
        where: {
          OR: [{ title: { contains: search, mode: 'insensitive' } }],
        },
      }),
      prisma.exam.findMany({
        where: {
          OR: [{ title: { contains: search, mode: 'insensitive' } }],
        },
        select: { id: true, title: true, description: true, createdAt: true },
        orderBy: sorting ? orderBy(sorting) : undefined,
        skip,
        take,
      }),
    ]).then(([count, exams]) => ({
      count,
      exams,
    }));
  }

  static async createExam(input: ExamValidation) {
    const {
      title,
      description,
      facultyId,
      studentGradeId,
      studentGradeGroupId,
      studentIds,
      questions,
    } = input;

    return await prisma.$transaction(async prisma => {
      const exam = await prisma.exam.create({
        data: {
          title,
          description,
          facultyId,
          studentGradeId,
          studentGradeGroupId,
          testQuestions: {
            create: questions.map(question => ({
              title: question.questionText,
              type: question.questionType,
              skillLevel: question.skillLevel,
              options: {
                create: question.answers.map(answer => ({
                  title: answer.title,
                  isRightAnswer: answer.isRightAnswer,
                })),
              },
            })),
          },
        },
        include: {
          testQuestions: {
            include: {
              options: true,
            },
          },
        },
      });

      for (const studentId of studentIds) {
        await prisma.studentExam.create({
          data: {
            studentId,
            examId: exam.id,
          },
        });
      }

      return exam;
    });
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

  static async getExamDataById(examId: string) {
    return prisma.exam.findUnique({
      where: {
        id: examId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        studentExams: {
          select: {
            studentId: true,
          },
        },
        faculty: {
          select: {
            id: true,
            exams: {
              select: {
                id: true,
                studentExams: {
                  select: {
                    student: {
                      select: {
                        id: true,
                      },
                    },
                  },
                },
                testQuestions: {
                  select: {
                    id: true,
                    title: true,
                    options: {
                      select: {
                        id: true,
                        isRightAnswer: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        studentGradeId: true,
        studentGradeGroupId: true,
      },
    });

  }
}
