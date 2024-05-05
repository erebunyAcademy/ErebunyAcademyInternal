import { User, UserRoleEnum } from '@prisma/client';
import LogoutIcon from '/public/icons/log-out.svg';
import ProfileIcon from '/public/icons/profile.svg';
import { ReactNode } from 'react';
import {
  PROFILE_ROUTE,
  ROUTE_FACULTIES,
  ROUTE_STUDENTS,
  ROUTE_TEACHERS,
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
        { id: 5, name: 'Students', icon: <ProfileIcon />, href: ROUTE_STUDENTS },
        { id: 6, name: 'Teachers', icon: <ProfileIcon />, href: ROUTE_TEACHERS },
        commonLinks[1],
      ];
    case UserRoleEnum.TEACHER:
    case UserRoleEnum.STUDENT:
    default:
      return commonLinks;
  }
};

export const LOGOUT_ID = 9;
