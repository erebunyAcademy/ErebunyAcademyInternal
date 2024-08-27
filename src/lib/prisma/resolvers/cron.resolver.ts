import { GradeLevelTypeEnum } from '@prisma/client';
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

          await prisma.studentExam.updateMany({
            where: {
              examId: exam.id,
              hasFinished: false,
            },
            data: {
              hasFinished: true,
            },
          });
        }
      }
    }

    console.log('Exam status check completed');
  }

  static async updateCourseAndGroupGrades() {
    try {
      // Fetch all courses that need their grade level incremented
      const courses = await prisma.course.findMany({
        where: {
          gradeLevel: {
            isNot: null,
          },
        },
        include: {
          gradeLevel: true,
        },
      });

      for (const course of courses) {
        if (!course.gradeLevel || course.gradeLevel.level === 6) {
          continue;
        }
        const newLevel = course.gradeLevel.level + 1;

        // Fetch the new grade level
        const newGradeLevel = await prisma.gradeLevel.findUnique({
          where: {
            levelTypeUniqueId: {
              level: newLevel,
              type: GradeLevelTypeEnum.COURSE,
            },
          },
        });

        if (newGradeLevel) {
          // Update course grade level and title
          await prisma.course.update({
            where: { id: course.id },
            data: {
              gradeLevelId: newGradeLevel.id,
              title: `Grade ${newGradeLevel.level}`, // Adjust this as needed
            },
          });
        }
      }

      // Do the same for course groups
      const courseGroups = await prisma.courseGroup.findMany({
        where: {
          gradeLevel: {
            isNot: null,
          },
        },
        include: {
          gradeLevel: true,
        },
      });

      for (const group of courseGroups) {
        if (!group.gradeLevel || group.gradeLevel.level === 8) {
          continue;
        }
        const newLevel = group.gradeLevel.level + 1;

        // Fetch the new grade level for course groups
        const newGradeLevel = await prisma.gradeLevel.findUnique({
          where: {
            levelTypeUniqueId: {
              level: newLevel,
              type: GradeLevelTypeEnum.COURSE_GROUP,
            },
          },
        });

        if (newGradeLevel) {
          // Update course group grade level and title
          await prisma.courseGroup.update({
            where: { id: group.id },
            data: {
              gradeLevelId: newGradeLevel.id,
              title: `Group Grade ${newGradeLevel.level}`, // Adjust this as needed
            },
          });
        }
      }

      console.log('Course and Group grades updated successfully');
    } catch (error) {
      console.error('Error updating grades:', error);
    }
  }
}
