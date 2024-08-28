const PClient = require('@prisma/client');

const { PrismaClient } = PClient;
const prisma = new PrismaClient();

(async () => {
  for await (const level of Array.from({ length: 6 }, (_, i) => ++i)) {
    const createdGrade = await prisma.gradeLevel.create({
      data: {
        level,
      },
    });
    if (level === 1) {
      await prisma.course.updateMany({
        data: {
          gradeLevelId: createdGrade.id,
        },
      });
    }
  }
  for await (const level of Array.from({ length: 8 }, (_, i) => ++i)) {
    const createdGrade = await prisma.gradeLevel.create({
      data: {
        level,
        type: PClient.GradeLevelTypeEnum.COURSE_GROUP,
      },
    });
    if (level === 1) {
      await prisma.courseGroup.updateMany({
        data: {
          gradeLevelId: createdGrade.id,
        },
      });
    }
  }
})()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
