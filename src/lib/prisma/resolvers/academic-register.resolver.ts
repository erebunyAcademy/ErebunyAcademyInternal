import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ForbiddenException } from 'next-api-decorators';
import { User } from 'next-auth';
import {
  CreateStudentAttendanceRecordValidation,
  UpdateStudentAttendanceRecordsValidation,
} from '@/utils/validation/academic-register';
import prisma from '..';

dayjs.extend(utc);

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
    scheduleId: string,
    data: CreateStudentAttendanceRecordValidation,
    user: NonNullable<User>,
    lessonOfTheDay: string,
  ) {
    if (!user.teacher?.id) {
      throw new ForbiddenException();
    }
    const { students, thematicPlanIds, isCompletedLesson } = data;

    const today = new Date().toISOString().split('T')[0];

    const schedule = await prisma.schedule.findUniqueOrThrow({
      where: {
        id: scheduleId,
      },
      include: {
        academicRegister: {
          include: {
            academicRegisterDay: {
              where: {
                createdAt: {
                  gte: new Date(today + 'T00:00:00.000Z'),
                  lt: new Date(today + 'T23:59:59.999Z'),
                },
              },
              include: {
                academicRegisterLessons: {
                  where: {
                    lessonOfTheDay: +lessonOfTheDay,
                  },
                  include: {
                    attendanceRecord: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const thematicPlans = await prisma.thematicPlan.findMany({
      where: {
        scheduleId: schedule.id,
      },
      select: {
        thematicPlanDescription: {
          select: {
            id: true,
          },
        },
      },
    });

    const thematicPlanDescriptionIds = thematicPlans
      .flatMap(themplan => themplan.thematicPlanDescription)
      .map(({ id }) => id);

    const thematicPlansToSetCompleted = thematicPlanDescriptionIds.filter(thematicPlanid =>
      thematicPlanIds.includes(thematicPlanid),
    );
    const thematicPlansToSetNotCompleted = thematicPlanDescriptionIds.filter(
      thematicPlanid => !thematicPlanIds.includes(thematicPlanid),
    );

    await prisma.thematicPlanDescription.updateMany({
      where: {
        id: {
          in: thematicPlansToSetCompleted,
        },
      },
      data: {
        isCompleted: true,
      },
    });
    await prisma.thematicPlanDescription.updateMany({
      where: {
        id: {
          in: thematicPlansToSetNotCompleted,
        },
      },
      data: {
        isCompleted: false,
      },
    });

    let academicRegister = schedule.academicRegister;

    if (!academicRegister) {
      academicRegister = await prisma.academicRegister.create({
        data: {
          courseGroupId: schedule.courseGroupId,
          subjectId: schedule.subjectId,
          scheduleId: schedule.id,
        },
        include: {
          academicRegisterDay: {
            include: {
              academicRegisterLessons: {
                include: {
                  attendanceRecord: true,
                },
              },
            },
          },
        },
      });
    }

    // Get today's AcademicRegisterDay or create it if it doesn't exist
    let academicRegisterDay = academicRegister.academicRegisterDay.length
      ? academicRegister.academicRegisterDay[0]
      : await prisma.academicRegisterDay.create({
          data: {
            academicRegisterId: academicRegister.id,
          },
          include: {
            academicRegisterLessons: {
              include: {
                attendanceRecord: true, // Ensure attendanceRecord is included
              },
            },
          },
        });

    // Get today's AcademicRegisterLesson or create it if it doesn't exist
    let academicRegisterLesson = academicRegisterDay.academicRegisterLessons.length
      ? academicRegisterDay.academicRegisterLessons[0]
      : await prisma.academicRegisterLesson.create({
          data: {
            academicRegisterId: academicRegister.id,
            academicRegisterDayId: academicRegisterDay.id,
            lessonOfTheDay: +lessonOfTheDay,
          },
          include: {
            attendanceRecord: true, // Ensure attendanceRecord is included
          },
        });

    if (academicRegisterLesson.isCompletedLesson) {
      throw new ForbiddenException();
    }

    if (isCompletedLesson) {
      await prisma.academicRegisterLesson.update({
        where: {
          id: academicRegisterLesson.id,
        },
        data: {
          isCompletedLesson: true,
        },
      });
    }

    // Process attendance records: update existing or create new ones
    for (const student of students) {
      const existingRecord = academicRegisterLesson.attendanceRecord.find(
        record => record.studentId === student.id,
      );

      if (existingRecord) {
        // Update the existing attendance record
        await prisma.attendanceRecord.update({
          where: { id: existingRecord.id },
          data: {
            academicRegisterDayId: academicRegisterDay.id,
            isPresent: student.isPresent,
            mark: student.mark ? parseInt(student.mark) : null,
          },
        });
      } else {
        // Create a new attendance record
        await prisma.attendanceRecord.create({
          data: {
            studentId: student.id,
            academicRegisterDayId: academicRegisterDay.id,
            academicRegisterId: academicRegister.id,
            academicRegisterLessonId: academicRegisterLesson.id,
            isPresent: student.isPresent,
            mark: student.mark ? parseInt(student.mark) : null,
            subjectId: schedule.subjectId,
          },
        });
      }
    }

    return true;
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
          scheduleId,
          courseGroupId: courseGroup.id,
          subjectId: courseGroup.schedules[0].subjectId,
        },
      },
      include: {
        attendanceRecords: true,
      },
    });
  }

  static async getStudentAcademicRegisterdata(
    user: NonNullable<User>,
    startDate?: string,
    endDate?: string,
  ) {
    if (!user.student?.id) {
      throw new ForbiddenException();
    }

    const todayStart = dayjs(startDate).utc().startOf('day').toDate();
    const todayEnd = dayjs(endDate).utc().endOf('day').toDate();

    return prisma.academicRegisterDay.findMany({
      where: {
        academicRegister: {
          courseGroupId: user.student.courseGroup?.id,
        },
        createdAt: {
          gt: todayStart,
          lt: todayEnd,
        },
      },
      include: {
        academicRegisterLessons: {
          orderBy: {
            lessonOfTheDay: 'asc',
          },
          include: {
            attendanceRecord: {
              where: {
                studentId: user.student.id,
              },
            },
            academicRegister: {
              include: {
                schedule: {
                  include: {
                    subject: true,
                    thematicPlans: {
                      include: {
                        thematicPlanDescription: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  static async getTeacherAcademicRegisterLessonList(scheduleId: string, user: NonNullable<User>) {
    if (!user?.teacher?.id) {
      throw new ForbiddenException();
    }

    const todayStart = dayjs().utc().startOf('day').toDate();
    const todayEnd = dayjs().utc().endOf('day').toDate();

    return prisma.academicRegister.findFirst({
      where: {
        scheduleId,
      },
      select: {
        academicRegisterLesson: {
          where: {
            createdAt: {
              gt: todayStart,
              lt: todayEnd,
            },
          },
          select: {
            lessonOfTheDay: true,
          },
        },
      },
    });
  }

  static async getAcademicRegisterByCourseGroupId(
    courseGroupId: string,
    startDate?: string,
    endDate?: string,
  ) {
    const courseGroup = await prisma.courseGroup.findUniqueOrThrow({
      where: {
        id: courseGroupId,
      },
    });

    const today = new Date().toISOString().split('T')[0];

    const effectiveStartDate = startDate
      ? dayjs(startDate).utc().startOf('day').toDate()
      : dayjs(today).utc().startOf('day').toDate();

    const effectiveEndDate = endDate
      ? dayjs(endDate).utc().endOf('day').toDate()
      : dayjs(startDate || today)
          .utc()
          .endOf('day')
          .toDate();

    console.log({ effectiveStartDate });

    return prisma.academicRegisterDay.findMany({
      where: {
        createdAt: {
          gte: effectiveStartDate,
          lt: effectiveEndDate,
        },
        academicRegister: {
          courseGroupId: courseGroup.id,
        },
      },
      include: {
        academicRegister: true,
        academicRegisterLessons: {
          include: {
            academicRegister: {
              include: {
                schedule: {
                  include: {
                    scheduleTeachers: {
                      include: {
                        teacher: {
                          include: {
                            user: true,
                          },
                        },
                      },
                    },
                  },
                },
                subject: true,
              },
            },
            attendanceRecord: {
              where: {
                student: {
                  user: {
                    isAdminVerified: true,
                    isVerified: true,
                  },
                },
              },
              include: {
                student: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
          orderBy: {
            lessonOfTheDay: 'asc',
          },
        },
      },
    });
  }

  static async changeAttendanceRecordData(input: UpdateStudentAttendanceRecordsValidation) {
    const updatePromises = input.attendantRecords.map(record => {
      return prisma.attendanceRecord.update({
        where: { id: record.id },
        data: {
          isPresent: record.isPresent,
          mark: record.isPresent ? (record.mark ? +record.mark : undefined) : null,
        },
      });
    });

    await Promise.all(updatePromises);
    return true;
  }
}
