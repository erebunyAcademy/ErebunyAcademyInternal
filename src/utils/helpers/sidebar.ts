import { User } from '@prisma/client';
import {
  ROUTE_FACULTIES,
  ROUTE_STUDENT_GRADE_GROUPS,
  ROUTE_STUDENT_GRADES,
  ROUTE_SUBJECTS,
  ROUTE_TEACHERS,
  ROUTE_USERS,
} from '../constants/routes';

export const studentLinkItems = (user: User) => {
  console.log(user);
  return [
    {
      name: 'Personal',
      children: [{ title: 'Profile', href: '/profile' }],
    },
  ];
};
export const adminLinkItems = (user: User) => {
  console.log(user);

  return [
    {
      name: 'Common',
      children: [
        { title: 'Teachers', href: ROUTE_TEACHERS },
        { title: 'Faculties', href: ROUTE_FACULTIES },
        { title: 'Student grades', href: ROUTE_STUDENT_GRADES },
        { title: 'Student grade groups', href: ROUTE_STUDENT_GRADE_GROUPS },
        { title: 'Subjects', href: ROUTE_SUBJECTS },
      ],
    },
    {
      name: 'Students',
      children: [{ title: 'College students', href: ROUTE_USERS }],
    },
  ];
};
export const teacherLinkItems = (user: User) => {
  console.log(user);

  return [
    {
      name: 'Personal',
      children: [{ title: 'Profile', href: '/profile' }],
    },
  ];
};
