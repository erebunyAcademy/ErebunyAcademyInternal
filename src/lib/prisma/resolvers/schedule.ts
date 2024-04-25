import { NotFoundException } from 'next-api-decorators';
import prisma from '..';
import { Schedule } from '@prisma/client';

export type ScheduleUpdateableType = Omit<Schedule, 'id'>;

export class ScheduleResolver {
  static createSchedule(data: ScheduleUpdateableType) {
    return prisma.schedule.create({ data });
  }

  static getScheduleById(id: number) {
    return prisma.schedule
      .findUnique({
        where: { id },
      })
      .then(res => {
        if (!res) {
          throw new NotFoundException('Schedule was not found');
        }
        return res;
      });
  }

  static getScheduleList() {
    return prisma.schedule.findMany();
  }

  static async updateScheduleById(scheduleId: number, data: Partial<ScheduleUpdateableType>) {
    const { id } = await this.getScheduleById(scheduleId);

    return prisma.schedule.update({
      where: {
        id,
      },
      data,
    });
  }

  static async deleteScheduleById(examId: number) {
    const { id } = await this.getScheduleById(examId);
    return prisma.schedule.delete({
      where: {
        id,
      },
    });
  }
}
