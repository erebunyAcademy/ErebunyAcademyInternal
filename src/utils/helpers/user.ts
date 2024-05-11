import { UserRoleEnum } from '@prisma/client';
import { User } from 'next-auth';

export const getUserData = (user: User) => {
  const data = [
    {
      id: 1,
      title: 'First name',
      value: user.firstName,
    },
    {
      id: 2,
      title: 'Last name',
      value: user.lastName,
    },
    {
      id: 3,
      title: 'Email',
      value: user.email,
    },
    {
      id: 4,
      title: 'Country',
      value: user.country,
    },
    {
      id: 5,
      title: 'State',
      value: user.state,
    },
    {
      id: 6,
      title: 'City',
      value: user.city,
    },
  ];
  if (user.role === UserRoleEnum.STUDENT) {
    data.concat([
      {
        id: 7,
        title: 'Faculty',
        value: user.student.faculty.title,
      },
      {
        id: 8,
        title: 'Student Grade',
        value: user.student.studentGrade.title,
      },
      {
        id: 9,
        title: 'Student Grade group',
        value: user.student.studentGradeGroup.title,
      },
    ]);
  } else if (user.role === UserRoleEnum.TEACHER) {
    console.log(user.teacher);

    data.concat([
      {
        id: 10,
        title: 'Profession',
        value: user.teacher.profession,
      },
      {
        id: 11,
        title: 'Workplace',
        value: user.teacher.workPlace,
      },
      {
        id: 12,
        title: 'Scientific Activity',
        value: user.teacher.scientificActivity,
      },
    ]);
  }
  return data;
};
