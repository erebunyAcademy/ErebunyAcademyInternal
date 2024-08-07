import { ForbiddenException } from 'next-api-decorators';
import { User } from 'next-auth';
import { CreateStudentAttentdanceRecordValidation } from '@/utils/validation/academic-register';
import prisma from '..';

export class AcademicRegisterResolver {
  static async list(user: NonNullable<User>) {
    if (!user || !user.id) {
      throw new Error('User not authenticated');
    }

    const teacher = await prisma.teacher.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!teacher) {
      throw new Error('User is not a teacher');
    }

    const schedules = await prisma.schedule.findMany({
      where: {
        scheduleTeachers: {
          some: {
            teacherId: teacher.id,
          },
        },
      },
      include: {
        courseGroup: {
          include: {
            course: true,
          },
        },
        subject: true,
      },
    });

    return schedules;
  }

  static async getScheduleRecordById(scheduleId: string, user: NonNullable<User>) {
    const teacher = await prisma.teacher.findUniqueOrThrow({
      where: { userId: user.id },
      select: { id: true },
    });

    return prisma.schedule.findUniqueOrThrow({
      where: {
        id: scheduleId,
        scheduleTeachers: {
          some: {
            teacherId: teacher.id,
          },
        },
      },
      include: {
        courseGroup: true,
      },
    });
  }

  static async createStudentAddentanceRecord(
    courseGroupId: string,
    data: CreateStudentAttentdanceRecordValidation,
    user: NonNullable<User>,
    lessonOfTheDay: string,
    academicRegisterId?: string,
  ) {
    if (!user.teacher?.id) {
      throw new ForbiddenException();
    }
    const { students } = data;

    const scheduleTeacher = await prisma.scheduleTeacher.findMany({
      where: {
        teacherId: user.teacher.id,
      },
      select: {
        id: true,
      },
    });

    const courseGroup = await prisma.courseGroup.findUniqueOrThrow({
      where: {
        id: courseGroupId,
        schedules: {
          some: {
            scheduleTeachers: {
              some: {
                id: {
                  in: scheduleTeacher.map(({ id }) => id),
                },
              },
            },
          },
        },
      },
      select: {
        id: true,
        schedules: {
          select: {
            subjectId: true,
          },
        },
      },
    });

    let academicRegister = await prisma.academicRegister.findUnique({
      where: {
        academicRegisterSubjectCourseGroupId: {
          courseGroupId: courseGroup.id,
          subjectId: courseGroup.schedules[0].subjectId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!academicRegister) {
      academicRegister = await prisma.academicRegister.create({
        data: {
          courseGroupId: courseGroup.id,
          subjectId: courseGroup.schedules[0].subjectId,
        },
        select: {
          id: true,
        },
      });
    }

    return prisma.attendanceRecord.createMany({
      data: students.map(student => ({
        studentId: student.id,
        academicRegisterId: academicRegister.id,
        lessonOfTheDay,
        mark: +student.mark,
        isAbsent: !student.isPresent,
        subjectId: courseGroup.schedules[0].subjectId,
      })),
    });
  }

  static async getAcademicRegister(
    courseGroupId: string,
    scheduleId: string,
    user: NonNullable<User>,
  ) {
    if (!user.teacher?.id) {
      throw new ForbiddenException();
    }

    const scheduleTeacher = await prisma.scheduleTeacher.findMany({
      where: {
        teacherId: user.teacher.id,
        scheduleId,
      },
      select: {
        id: true,
      },
    });

    const courseGroup = await prisma.courseGroup.findUniqueOrThrow({
      where: {
        id: courseGroupId,
        schedules: {
          some: {
            scheduleTeachers: {
              some: {
                id: {
                  in: scheduleTeacher.map(({ id }) => id),
                },
              },
            },
          },
        },
      },
      select: {
        id: true,
        schedules: {
          select: {
            subjectId: true,
          },
        },
      },
    });

    return prisma.academicRegister.findUnique({
      where: {
        academicRegisterSubjectCourseGroupId: {
          courseGroupId: courseGroup.id,
          subjectId: courseGroup.schedules[0].subjectId,
        },
      },
      include: {
        attendanceRecords: true,
      },
    });
  }
}
