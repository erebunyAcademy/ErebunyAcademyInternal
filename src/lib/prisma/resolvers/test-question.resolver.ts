import { BadRequestException } from 'next-api-decorators';
import { TestQuestionValidation } from '@/utils/validation/exam';
import prisma from '..';

export class TestQuestionResolver {
  static getTestQuestionsBySubjectId(subjectId: string) {
    return prisma.testQuestion.findMany({
      where: {
        subjectId,
      },
      select: {
        options: {
          select: {
            title: true,
          },
        },
        title: true,
        id: true,
      },
    });
  }

  static async create(body: TestQuestionValidation, subjectId?: string) {
    if (!subjectId) {
      throw new BadRequestException('Invalid data');
    }

    const createOptions = body.questions.map(item => {
      return prisma.testQuestion.create({
        data: {
          subjectId,
          title: item.title,
          type: item.type,
          skillLevel: 'BEGINNER',
          language: 'AM',
          options: {
            createMany: {
              data: item.options.map(el => ({
                title: el.title,
                isRightAnswer: el.isRightAnswer,
              })),
            },
          },
        },
      });
    });

    await Promise.all(createOptions);

    return true;
  }
}
