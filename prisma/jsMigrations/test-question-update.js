const PClient = require('@prisma/client');
const { PrismaClient } = PClient;
const prisma = new PrismaClient();

(async () => {
  const examTranslations = await prisma.examTranslation.findMany({
    select: {
      id: true,
      examTranslationTests: {
        select: {
          testQuestionId: true,
        },
      },
    },
  });

  for await (const examTranslation of examTranslations) {
    const testQuestionIds = examTranslation.examTranslationTests.map(
      ({ testQuestionId }) => testQuestionId,
    );

    await prisma.testQuestion.updateMany({
      where: {
        id: {
          in: testQuestionIds,
        },
      },
      data: {
        examTranslationId: examTranslation.id,
      },
    });
  }
})();
