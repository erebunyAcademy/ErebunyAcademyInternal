import { Faculty } from '@prisma/client';
import { NotFoundException } from 'next-api-decorators';
import prisma from '..';

export class FacultyResolver {
  static createFaculty(data: Pick<Faculty, 'title' | 'description'>) {
    return prisma.faculty.create({ data });
  }

  static getFacultyById(id: string) {
    return prisma.faculty
      .findUnique({
        where: { id },
      })
      .then(res => {
        if (!res) {
          throw new NotFoundException('Faculty was not found');
        }
        return res;
      });
  }

  static getFacultyList() {
    return prisma.faculty.findMany({
      select: {
        id: true,
        title: true,
      },
    });
  }

  static async updateFacultyById(facultyId: number, data: Partial<Faculty>) {
    const { id } = await this.getFacultyById(facultyId);

    return prisma.faculty.update({
      where: {
        id,
      },
      data,
    });
  }

  static async deleteFacultyById(examId: number) {
    const { id } = await this.getFacultyById(examId);
    return prisma.faculty.delete({
      where: {
        id,
      },
    });
  }
}
