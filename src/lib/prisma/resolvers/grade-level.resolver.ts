import { GradeLevelTypeEnum } from '@prisma/client';
import prisma from '..';

export class GradeLevelResolver {
  static list(type: GradeLevelTypeEnum) {
    return prisma.gradeLevel.findMany({
      where: {
        type,
      },
      select: {
        id: true,
        level: true,
      },
    });
  }
  static async updateCourseAndGroupGrades() {
    try {
      const courses = await prisma.course.findMany({
        where: {
          gradeLevel: {
            isNot: null,
          },
        },
        include: {
          gradeLevel: true,
          faculty: true,
        },
      });

      for (const course of courses) {
        if (!course.gradeLevel || course.gradeLevel.level === 6) {
          continue;
        }
        const newLevel = course.gradeLevel.level + 1;

        const newGradeLevel = await prisma.gradeLevel.findUnique({
          where: {
            levelTypeUniqueId: {
              level: newLevel,
              type: GradeLevelTypeEnum.COURSE,
            },
          },
        });

        const needToBeUpgraded = await prisma.course.findFirst({
          where: {
            facultyId: course.facultyId,
            gradeLevel: {
              level: newLevel,
            },
          },
        });

        if (newGradeLevel) {
          await prisma.course.update({
            where: { id: course.id },
            data: {
              gradeLevelId: newGradeLevel.id,
              ...(needToBeUpgraded ? { title: needToBeUpgraded.title } : {}),
            },
          });
        }
      }

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

        const newGradeLevel = await prisma.gradeLevel.findUnique({
          where: {
            levelTypeUniqueId: {
              level: newLevel,
              type: GradeLevelTypeEnum.COURSE_GROUP,
            },
          },
        });

        const nextCourseGroup = await prisma.courseGroup.findFirst({
          where: {
            courseId: group.courseId,
            gradeLevel: {
              level: newLevel,
            },
          },
        });

        if (newGradeLevel) {
          await prisma.courseGroup.update({
            where: { id: group.id },
            data: {
              gradeLevelId: newGradeLevel.id,
              ...(nextCourseGroup ? { title: nextCourseGroup.title } : {}),
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
