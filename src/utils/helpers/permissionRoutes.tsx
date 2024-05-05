import { User, UserRoleEnum } from '@prisma/client';
import LogoutIcon from '/public/icons/log-out.svg';
import ProfileIcon from '/public/icons/profile.svg';
import { ReactNode } from 'react';
import {
  PROFILE_ROUTE,
  ROUTE_EXAMS,
  ROUTE_FACULTIES,
  ROUTE_STUDENT_GRADE_GROUPS,
  ROUTE_STUDENT_GRADES,
  ROUTE_STUDENTS,
} from '../constants/routes';

export interface LinkItemProps {
  name: string;
  icon: ReactNode;
  id: number;
  href?: string;
}

export type LinkItemsFunction = (user: User) => Array<LinkItemProps>;

export const linkItems: LinkItemsFunction = (user: User) => {
  const commonLinks = [
    { id: 1, name: 'Profile', icon: <ProfileIcon />, href: PROFILE_ROUTE },
    { id: 9, name: 'Log out', icon: <LogoutIcon /> },
  ];

  switch (user.role) {
    case UserRoleEnum.ADMIN:
      return [
        ...commonLinks.slice(0, 1),
        { id: 2, name: 'Faculty', icon: <ProfileIcon />, href: ROUTE_FACULTIES },
        { id: 3, name: 'Student Grade', icon: <ProfileIcon />, href: ROUTE_STUDENT_GRADES },
        {
          id: 4,
          name: 'Student Grade Group',
          icon: <ProfileIcon />,
          href: ROUTE_STUDENT_GRADE_GROUPS,
        },
        { id: 5, name: 'Students', icon: <ProfileIcon />, href: ROUTE_STUDENTS },
        { id: 6, name: 'Exams', icon: <ProfileIcon />, href: ROUTE_EXAMS },

        commonLinks[1],
      ];
    case UserRoleEnum.TEACHER:
    case UserRoleEnum.STUDENT:
    default:
      return commonLinks;
  }
};

export const LOGOUT_ID = 9;
