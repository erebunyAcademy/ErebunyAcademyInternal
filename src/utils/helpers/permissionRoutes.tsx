import { User, UserRoleEnum } from '@prisma/client';
import LogoutIcon from '/public/icons/log-out.svg';
import ProfileIcon from '/public/icons/profile.svg';
import StudentIcon from '/public/icons/student_icon.svg';
import ExamsIcon from '/public/icons/exams_icon.svg';
import TeacherIcon from '/public/icons/teacher_icon.svg';
import FacultiesIcon from '/public/icons/faculty_icon.svg';
import StudentGradeIcon from '/public/icons/students_grade_icon.svg';
import StudentGradeGroupIcon from '/public/icons/students_grade_group_icon.svg';
import {
  PROFILE_ROUTE,
  ROUTE_EXAMS,
  ROUTE_FACULTIES,
  ROUTE_STUDENT_GRADE_GROUPS,
  ROUTE_STUDENT_GRADES,
  ROUTE_STUDENTS,
  ROUTE_TEACHERS,
} from '../constants/routes';
import { ReactNode } from 'react';

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
        { id: 2, name: 'Faculty', icon: <FacultiesIcon />, href: ROUTE_FACULTIES },
        { id: 3, name: 'Students', icon: <StudentIcon />, href: ROUTE_STUDENTS },
        { id: 4, name: 'Student Grade', icon: <StudentGradeIcon />, href: ROUTE_STUDENT_GRADES },
        {
          id: 5,
          name: 'Student Grade group',
          icon: <StudentGradeGroupIcon />,
          href: ROUTE_STUDENT_GRADE_GROUPS,
        },
        { id: 6, name: 'Exams', icon: <ExamsIcon />, href: ROUTE_EXAMS },
        { id: 7, name: 'Teachers', icon: <TeacherIcon />, href: ROUTE_TEACHERS },
        commonLinks[1],
      ];
    case UserRoleEnum.TEACHER:
    case UserRoleEnum.STUDENT:
    default:
      return commonLinks;
  }
};

export const LOGOUT_ID = 9;
