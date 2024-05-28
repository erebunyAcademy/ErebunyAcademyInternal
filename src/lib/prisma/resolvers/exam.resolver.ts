import { Exam, LanguageTypeEnum } from '@prisma/client';
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
          examLanguages: {
            every: {
              AND: {
                language: 'AM', // todo, need to set current lang
                OR: [{ title: { contains: search, mode: 'insensitive' } }],
              },
            },
          },
        },
      }),
      prisma.exam.findMany({
        where: {
          examLanguages: {
            every: {
              AND: {
                language: 'AM', // todo
                OR: [{ title: { contains: search, mode: 'insensitive' } }],
              },
            },
          },
        },
        select: { id: true, examLanguages: true, createdAt: true },
        orderBy: sorting ? orderBy(sorting) : undefined,
        skip,
        take,
      }),
    ]).then(([count, exams]) => ({
      count,
      exams,
    }));
  }

  static async createExamBySubjectId(subjectId: string) {
    return prisma.exam.create({
      data: {
        subjectId,
      },
      select: {
        id: true,
      },
    });
  }

  static async createExam(input: ExamValidation, examId?: string) {
    const { title, description, subjectId, studentIds } = input;

    let exam = await prisma.exam.findUnique({
      where: {
        id: examId,
      },
    });

    if (!exam) {
      exam = await prisma.exam.create({
        data: {
          subjectId,
        },
      });
    }

    const createdTranslation = await prisma.examTranslation.create({
      data: {
        examId: exam.id,
        title,
        description,
        language: LanguageTypeEnum.AM,
      },
    });

    await Promise.all([
      prisma.testQuestion.updateMany({
        where: {
          id: {
            in: input.testQuestionIds,
          },
        },
        data: {
          examTranslationId: createdTranslation.id,
        },
      }),
      prisma.studentExam.createMany({
        data: studentIds.map(id => ({
          examId: exam.id,
          studentId: id,
        })),
      }),
    ]);

    return exam;
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

  static async getExamDataById(examId: string) {
    console.log({ examId });
    // return prisma.exam.findUnique({
    //   where: {
    //     id: examId,
    //   },
    //   select: {
    //     id: true,
    //     studentExams: {
    //       select: {
    //         studentId: true,
    //       },
    //     },
    //     faculty: {
    //       select: {
    //         id: true,
    //         exams: {
    //           select: {
    //             id: true,
    //             studentExams: {
    //               select: {
    //                 student: {
    //                   select: {
    //                     id: true,
    //                   },
    //                 },
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //     studentGradeId: true,
    //     studentGradeGroupId: true,
    //     examLanguages: {
    //       where: {
    //         language: 'AM', // todo
    //       },
    //       select: {
    //         title: true,
    //         description: true,
    //         language: true,
    //         testQuestions: {
    //           select: {
    //             id: true,
    //             title: true,
    //             options: {
    //               select: {
    //                 id: true,
    //                 isRightAnswer: true,
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    // });
  }
}
