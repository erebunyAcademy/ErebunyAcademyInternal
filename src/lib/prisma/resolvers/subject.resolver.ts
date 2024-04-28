import { Subject } from '@prisma/client';
import { NotFoundException } from 'next-api-decorators';
import prisma from '..';

export class SubjectResolver {
  static createSubject(data: Pick<Subject, 'title' | 'description'>) {
    return prisma.subject.create({ data });
  }

  static getSubjectById(id: number) {
    return prisma.subject
      .findUnique({
        where: { id: +id },
      })
      .then(res => {
        if (!res) {
          throw new NotFoundException('Subject was not found');
        }
        return res;
      });
  }

  static getSubjects() {
    return prisma.subject.findMany();
  }

  static async updateSubjectById(id: number, data: Partial<Subject>) {
    const subject = await this.getSubjectById(id);

    return prisma.subject.update({
      where: {
        id: subject.id,
      },
      data,
    });
  }

  static async deleteSubjectById(id: number) {
    const subject = await this.getSubjectById(id);
    return prisma.subject.delete({
      where: {
        id: subject.id,
      },
    });
  }
}
