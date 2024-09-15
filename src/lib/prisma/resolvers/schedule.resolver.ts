import { AttachmentTypeEnum, ScheduleTypeEnum, ThematicSubPlanTypeEnum } from '@prisma/client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import fs from 'fs';
import path from 'path';
import { CreateEditNonCyclicScheduleValidation } from '@/utils/validation/non-cyclic';
import {
  AddEditThematicPlanValidation,
  CreateEditScheduleValidation,
  TeacherAttachmentModalValidation,
  UpdateScheduleByTeacherValidation,
} from '@/utils/validation/schedule';
import prisma from '..';
import { AWSService } from '../services/AWS.service';

dayjs.extend(utc);

export class ScheduleResolver {
  static list(type: ScheduleTypeEnum) {
    return prisma.courseGroup.findMany({
      where: {
        schedules: {
          some: {
            type: type,
          },
        },
      },
      include: {
        schedules: {
          where: {
            type: type,
          },
          include: {
            subject: true,
            thematicPlans: {
              include: {
                thematicPlanDescription: true,
              },
            },
            scheduleTeachers: {
              select: {
                teacher: {
                  select: {
                    user: {
                      select: {
                        firstName: true,
                        lastName: true,
                      },
                    },
                  },
                },
                teacherId: true,
              },
            },
            attachment: {
              select: {
                key: true,
                title: true,
                mimetype: true,
              },
            },
            availableDays: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            faculty: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });
  }

  static async createThematicPlan(scheduleId: string, data: AddEditThematicPlanValidation) {
    const cyclicSchedule = await prisma.schedule.findUniqueOrThrow({
      where: {
        id: scheduleId,
      },
    });

    const { practicalClass, theoreticalClass } = data;

    await prisma.thematicPlan.create({
      data: {
        scheduleId: cyclicSchedule.id,
        totalHours: +practicalClass.totalHours,
        type: ThematicSubPlanTypeEnum.PRACTICAL,
        thematicPlanDescription: {
          create: practicalClass.classDescriptionRow.map(row => ({
            title: row.title,
            hour: row.hour,
          })),
        },
      },
    });

    // Create Theoretical Thematic Plan
    return prisma.thematicPlan.create({
      data: {
        scheduleId: cyclicSchedule.id,
        totalHours: +theoreticalClass.totalHours,
        type: ThematicSubPlanTypeEnum.THEORETICAL,
        thematicPlanDescription: {
          create: theoreticalClass.classDescriptionRow.map(row => ({
            title: row.title,
            hour: row.hour,
          })),
        },
      },
    });
  }

  static async updateThematicPlan(scheduleId: string, data: AddEditThematicPlanValidation) {
    const schedule = await prisma.schedule.findUniqueOrThrow({
      where: {
        id: scheduleId,
      },
    });

    await prisma.thematicPlan.deleteMany({
      where: { scheduleId: schedule.id },
    });

    return ScheduleResolver.createThematicPlan(schedule.id, data);
  }

  static async createSchedule(
    data: CreateEditScheduleValidation | CreateEditNonCyclicScheduleValidation,
    type: ScheduleTypeEnum,
  ) {
    if (type === ScheduleTypeEnum.CYCLIC) {
      const {
        title,
        description,
        totalHours,
        startDayDate,
        endDayDate,
        teacherId,
        links,
        subjectId,
        examDate,
        attachments,
      } = data as CreateEditScheduleValidation;

      const createdSchedule = await prisma.schedule.create({
        data: {
          courseGroupId: data.courseGroupId,
          title,
          type,
          description,
          examType: data.examType,
          totalHours: +totalHours,
          startDayDate: new Date(startDayDate),
          endDayDate: new Date(endDayDate),
          subjectId: data.subjectId,
          academicYear: data.academicYear,
          links: links.map(({ link }) => link),
          scheduleTeachers: {
            create: {
              teacherId,
              subjectId,
            },
          },
          examDate: new Date(examDate),
        },
        select: {
          id: true,
        },
      });

      if (attachments) {
        await prisma.attachment.createMany({
          data: attachments.map(attachment => ({
            title: attachment.title,
            key: attachment.key,
            scheduleId: createdSchedule.id,
            type: AttachmentTypeEnum.FILE,
            mimetype: attachment.mimetype,
          })),
        });
      }

      return createdSchedule;
    } else {
      const {
        academicYear,
        availableDays = [],
        description,
        totalHours,
        examType,
        teacherId,
        links,
        subjectId,
        title,
        attachments,
        courseGroupId,
      } = data as CreateEditNonCyclicScheduleValidation;

      const createdSchedule = await prisma.schedule.create({
        data: {
          type,
          title,
          courseGroupId,
          description,
          academicYear,
          subjectId,
          examType,

          totalHours: +totalHours,
          links: links.map(({ link }) => link),
          scheduleTeachers: {
            create: {
              teacherId,
              subjectId,
            },
          },
        },
        select: {
          id: true,
        },
      });

      await prisma.scheduleTime.createMany({
        data: availableDays.map(day => ({
          dayOfWeek: day.dayOfWeek,
          lessonOfTheDay: day.lessonOfTheDay,
          scheduleId: createdSchedule.id,
        })),
      });

      if (attachments) {
        await prisma.attachment.createMany({
          data: attachments.map(attachment => ({
            title: attachment.title,
            key: attachment.key,
            scheduleId: createdSchedule.id,
            type: AttachmentTypeEnum.FILE,
            mimetype: attachment.mimetype,
          })),
        });
      }

      return createdSchedule;
    }
  }

  static async createUpdateScheduleAttachment(
    scheduleId: string,
    { links, attachments }: TeacherAttachmentModalValidation,
  ) {
    const schedule = await prisma.schedule.findUniqueOrThrow({
      where: {
        id: scheduleId,
      },
    });

    await prisma.schedule.update({
      where: {
        id: schedule.id,
      },
      data: {
        links: links.map(({ link }) => link),
      },
    });

    const existingAttachments = await prisma.attachment.findMany({
      where: {
        scheduleId: schedule.id,
      },
    });

    const existingAttachmentKeys = new Set(existingAttachments.map(att => att.key));
    const newAttachmentKeys = new Set(attachments?.map(att => att.key) || []);

    const attachmentsToDelete = existingAttachments.filter(att => !newAttachmentKeys.has(att.key));

    for (const attachment of attachmentsToDelete) {
      const filePath = path.join(process.cwd(), 'uploads', attachment.key);
      if (filePath) {
        const aws = new AWSService();
        await aws.deleteAttachment(filePath);
      }
    }

    await prisma.attachment.deleteMany({
      where: {
        key: {
          in: attachmentsToDelete.map(att => att.key),
        },
      },
    });

    const attachmentsToCreate = attachments?.filter(att => !existingAttachmentKeys.has(att.key));

    if (attachmentsToCreate?.length) {
      await prisma.attachment.createMany({
        data: attachmentsToCreate.map(attachment => ({
          title: attachment.title,
          key: attachment.key,
          scheduleId: schedule.id,
          type: AttachmentTypeEnum.FILE,
          mimetype: attachment.mimetype,
        })),
      });
    }

    return true;
  }

  static async updateSchedule(
    id: string,
    data: CreateEditScheduleValidation | CreateEditNonCyclicScheduleValidation,
  ) {
    const schedule = await prisma.schedule.findUniqueOrThrow({
      where: {
        id,
      },
    });

    if (schedule.type === ScheduleTypeEnum.CYCLIC) {
      const {
        title,
        description,
        totalHours,
        startDayDate,
        endDayDate,
        teacherId,
        links,
        subjectId,
        examDate,
        attachments,
        examType,
        courseGroupId,
      } = data as CreateEditScheduleValidation;

      return prisma.$transaction(async prisma => {
        await prisma.scheduleTeacher.deleteMany({
          where: { scheduleId: schedule.id },
        });

        const updatedSchedule = await prisma.schedule.update({
          where: {
            id: schedule.id,
          },
          data: {
            title,
            description,
            examType,
            courseGroupId,
            totalHours: +totalHours,
            startDayDate: new Date(startDayDate),
            endDayDate: new Date(endDayDate),
            subjectId: data.subjectId,
            academicYear: data.academicYear,
            links: {
              set: links.map(({ link }) => link),
            },
            scheduleTeachers: {
              create: {
                teacherId,
                subjectId,
              },
            },
            examDate: new Date(examDate),
          },
          select: {
            id: true,
          },
        });

        const existingAttachments = await prisma.attachment.findMany({
          where: {
            scheduleId: schedule.id,
          },
        });

        const existingAttachmentKeys = new Set(existingAttachments.map(att => att.key));
        const newAttachmentKeys = new Set(attachments?.map(att => att.key) || []);

        const attachmentsToDelete = existingAttachments.filter(
          att => !newAttachmentKeys.has(att.key),
        );

        for (const attachment of attachmentsToDelete) {
          const filePath = path.join(process.cwd(), 'uploads', attachment.key);
          if (filePath) {
            const aws = new AWSService();
            await aws.deleteAttachment(filePath);
          }
        }

        await prisma.attachment.deleteMany({
          where: {
            key: {
              in: attachmentsToDelete.map(att => att.key),
            },
          },
        });

        const attachmentsToCreate = attachments?.filter(
          att => !existingAttachmentKeys.has(att.key),
        );

        if (attachmentsToCreate?.length) {
          await prisma.attachment.createMany({
            data: attachmentsToCreate.map(attachment => ({
              title: attachment.title,
              key: attachment.key,
              scheduleId: updatedSchedule.id,
              type: AttachmentTypeEnum.FILE,
              mimetype: attachment.mimetype,
            })),
          });
        }

        return updatedSchedule;
      });
    } else {
      const {
        availableDays = [],
        description,
        totalHours,
        teacherId,
        links,
        subjectId,
        title,
        attachments,
        courseGroupId,
        examType,
        academicYear,
      } = data as CreateEditNonCyclicScheduleValidation;
      return prisma.$transaction(async prisma => {
        await prisma.scheduleTeacher.deleteMany({
          where: { scheduleId: schedule.id },
        });

        await prisma.scheduleTime.deleteMany({
          where: {
            scheduleId: schedule.id,
          },
        });

        await prisma.scheduleTime.createMany({
          data: availableDays.map(day => ({
            dayOfWeek: day.dayOfWeek,
            lessonOfTheDay: +day.lessonOfTheDay,
            scheduleId: schedule.id,
          })),
        });

        const updatedSchedule = await prisma.schedule.update({
          where: {
            id: schedule.id,
          },
          data: {
            courseGroupId,
            title,
            description,
            examType,
            academicYear,
            totalHours: +totalHours,
            subjectId: data.subjectId,
            links: {
              set: links.map(({ link }) => link),
            },
            scheduleTeachers: {
              create: {
                teacherId,
                subjectId,
              },
            },
          },
          select: {
            id: true,
          },
        });

        const existingAttachments = await prisma.attachment.findMany({
          where: {
            scheduleId: schedule.id,
          },
        });

        const existingAttachmentKeys = new Set(existingAttachments.map(att => att.key));
        const newAttachmentKeys = new Set(attachments?.map(att => att.key) || []);

        const attachmentsToDelete = existingAttachments.filter(
          att => !newAttachmentKeys.has(att.key),
        );

        for (const attachment of attachmentsToDelete) {
          const filePath = path.join(process.cwd(), 'uploads', attachment.key);
          if (filePath) {
            const aws = new AWSService();
            await aws.deleteAttachment(filePath);
          }
        }

        await prisma.attachment.deleteMany({
          where: {
            key: {
              in: attachmentsToDelete.map(att => att.key),
            },
          },
        });

        const attachmentsToCreate = attachments?.filter(
          att => !existingAttachmentKeys.has(att.key),
        );

        if (attachmentsToCreate?.length) {
          await prisma.attachment.createMany({
            data: attachmentsToCreate.map(attachment => ({
              title: attachment.title,
              key: attachment.key,
              nonCycleSchedule: updatedSchedule.id,
              type: AttachmentTypeEnum.FILE,
              mimetype: attachment.mimetype,
            })),
          });
        }

        return updatedSchedule;
      });
    }
  }

  static async deleteSchedule(id: string) {
    const schedule = await prisma.schedule.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        attachment: true,
      },
    });

    for (const attachment of schedule.attachment) {
      const filePath = path.join(process.cwd(), 'uploads', attachment.key);
      try {
        await fs.promises.access(filePath);
        const aws = new AWSService();
        await aws.deleteAttachment(filePath);
      } catch (err) {
        console.error(`Error deleting file ${filePath}:`, err);
      }
    }

    return prisma.schedule.delete({
      where: {
        id: schedule.id,
      },
    });
  }

  static getScheduleById(id: string, lessonOfTheDay?: string) {
    const today = new Date().toISOString().split('T')[0];

    return prisma.schedule.findUnique({
      where: {
        id,
      },
      include: {
        attachment: true,
        scheduleTeachers: {
          include: {
            teacher: {
              select: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
        thematicPlans: {
          include: {
            thematicPlanDescription: true,
          },
        },
        subject: true,
        availableDays: true,
        courseGroup: {
          include: {
            students: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
                attendanceRecord: {
                  where: {
                    academicRegisterDay: {
                      createdAt: {
                        gte: new Date(today + 'T00:00:00.000Z'),
                        lt: new Date(today + 'T23:59:59.999Z'),
                      },
                    },
                    academicRegisterLesson: {
                      isCompletedLesson: false,
                      lessonOfTheDay: lessonOfTheDay ? +lessonOfTheDay : undefined,
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

  static async updateScheduleDescription(
    scheduleId: string,
    input: UpdateScheduleByTeacherValidation,
  ) {
    const { description } = input;

    const existingSchedule = await prisma.schedule.findUniqueOrThrow({
      where: {
        id: scheduleId,
      },
    });

    return prisma.schedule.update({
      where: {
        id: existingSchedule.id,
      },
      data: {
        description,
      },
    });
  }
}
