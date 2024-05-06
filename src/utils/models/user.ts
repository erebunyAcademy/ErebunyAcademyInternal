import { Student, Teacher } from '@prisma/client';

export type UserModel = {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  createdAt: Date;
  teacher?: Teacher;
  student?: Student;
};
