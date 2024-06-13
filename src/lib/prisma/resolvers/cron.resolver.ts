import prisma from '..';

export class CronResolver {
  static async checkStartedExam() {
    return prisma.exam.count({
      where: {
        status: 'IN_PROGRESS',
      },
    });
  }
  static async checkExamStatus() {
    const startedExamCount = await this.checkStartedExam();

    console.log({ startedExamCount });

    if (!startedExamCount) {
      console.log('There is no started exam');
      return;
    }

    const exams = await prisma.exam.findMany({
      where: {
        status: 'IN_PROGRESS',
      },
    });

    const now = new Date();

    for (const exam of exams) {
      if (exam.examStartTime) {
        const examEndTime = new Date(exam.examStartTime.getTime() + exam.duration * 60000);

        if (now > examEndTime) {
          await prisma.exam
            .update({
              where: { id: exam.id },
              data: { status: 'COMPLETED' },
            })
            .then(() => {
              console.log('EXAM STATUS HAS BEEN SUCCESSFULLY UPDATED');
            });
        }
      }
    }

    console.log('Exam status check completed');
  }
}
