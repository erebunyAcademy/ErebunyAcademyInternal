import {
  Attachment,
  Faculty,
  Prisma,
  Student,
  StudentGrade,
  StudentGradeGroup,
  User,
} from '@prisma/client';
import { StudentResolver } from '@/lib/prisma/resolvers/student.resolver';

export type StudentsListModel = Prisma.PromiseReturnType<typeof StudentResolver.list>;

export interface StudentModel extends User {
  student: {
    faculty: Faculty;
    studentGrade: StudentGrade;
    studentGradeGroup: StudentGradeGroup;
  } & Student;
  attachment: Attachment[];
}

export type StudentsExamListModel = Prisma.PromiseReturnType<
  typeof StudentResolver.getStudentsByStudentGradeGroupId
>;
