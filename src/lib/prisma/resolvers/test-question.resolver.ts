import { LanguageTypeEnum } from '@prisma/client';
import { TestQuestionValidation } from '@/utils/validation/exam';
import { SubjectResolver } from './subject.resolver';
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

  static async createTestQuestions(subjectId: string, input: TestQuestionValidation) {
    const subject = await SubjectResolver.getSubjectById(subjectId);

    console.log({ subject });

    const data = input.questions.map(question => ({
      ...question,
      subjectId,
      language: LanguageTypeEnum.AM,
    }));

    return prisma.testQuestion.createMany({
      data,
    });
  }
}
