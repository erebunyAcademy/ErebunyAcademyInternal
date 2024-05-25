import { UserRoleEnum } from '@prisma/client';
import { User } from 'next-auth';

export const getUserData = (user: NonNullable<User>) => {
  return [
    {
      id: 1,
      title: 'firstName',
      value: user.firstName,
    },
    {
      id: 2,
      title: 'lastName',
      value: user.lastName,
    },
    {
      id: 3,
      title: 'email',
      value: user.email,
    },
    {
      id: 4,
      title: 'country',
      value: user.country,
    },
    {
      id: 5,
      title: 'state',
      value: user.state,
    },
    {
      id: 6,
      title: 'city',
      value: user.city,
    },
    ...(user.role === UserRoleEnum.STUDENT
      ? [
          {
            id: 7,
            title: 'Faculty',
            value: user.student?.faculty.title,
          },
          {
            id: 8,
            title: 'Student Grade',
            value: user.student?.studentGrade.title,
          },
          {
            id: 9,
            title: 'Student Grade group',
            value: user.student?.studentGradeGroup?.title,
          },
        ]
      : []),
    ...(user.role === UserRoleEnum.TEACHER
      ? [
          {
            id: 10,
            title: 'Profession',
            value: user.teacher?.profession,
          },
          {
            id: 11,
            title: 'Workplace',
            value: user.teacher?.workPlace,
          },
          {
            id: 12,
            title: 'Scientific Activity',
            value: user.teacher?.scientificActivity,
          },
        ]
      : []),
  ];
};
