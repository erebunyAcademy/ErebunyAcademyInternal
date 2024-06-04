import { UserRoleEnum } from '@prisma/client';
import { User } from 'next-auth';

export const getUserData = (user: NonNullable<User>) => {
  return [
    {
      title: 'userId',
      value: user.uniqueUserId,
    },
    {
      title: 'firstName',
      value: user.firstName,
    },
    {
      title: 'lastName',
      value: user.lastName,
    },
    {
      title: 'email',
      value: user.email,
    },
    {
      title: 'country',
      value: user.country,
    },
    {
      title: 'state',
      value: user.state,
    },
    {
      title: 'city',
      value: user.city,
    },
    ...(user.role === UserRoleEnum.STUDENT
      ? [
          {
            title: 'faculty',
            value: user.student?.faculty.title,
          },
          {
            title: 'course',
            value: user.student?.course.title,
          },
          {
            title: 'courseGroup',
            value: user.student?.courseGroup?.title,
          },
        ]
      : []),
    ...(user.role === UserRoleEnum.TEACHER
      ? [
          {
            title: 'profession',
            value: user.teacher?.profession,
          },
          {
            title: 'workPlace',
            value: user.teacher?.workPlace,
          },
          {
            title: 'scientificActivity',
            value: user.teacher?.scientificActivity,
          },
        ]
      : []),
  ];
};
