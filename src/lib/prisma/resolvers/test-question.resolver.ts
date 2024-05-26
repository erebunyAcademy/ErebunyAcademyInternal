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
}
