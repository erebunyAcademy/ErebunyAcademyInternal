import { ReactNode } from 'react';
import { User, UserRoleEnum } from '@prisma/client';
import ExamsIcon from '@/icons/exam_icon.svg';
import FacultiesIcon from '@/icons/faculty_icon.svg';
import LogoutIcon from '@/icons/log-out.svg';
import ProfileIcon from '@/icons/profile.svg';
import StudentIcon from '@/icons/student_icon.svg';
import StudentGradeGroupIcon from '@/icons/students_grade_group_icon.svg';
import StudentGradeIcon from '@/icons/students_grade_icon.svg';
import SubjectsIcon from '@/icons/subjects_icon.svg';
import TeacherIcon from '@/icons/teacher_icon.svg';
import {
  ROUTE_DASHBOARD,
  ROUTE_EXAMS,
  ROUTE_FACULTIES,
  ROUTE_PROFILE,
  ROUTE_STUDENT_GRADE_GROUPS,
  ROUTE_STUDENT_GRADES,
  ROUTE_STUDENTS,
  ROUTE_SUBJECTS,
  ROUTE_TEACHERS,
} from '../constants/routes';
import { Maybe } from '../models/common';

export interface LinkItemProps {
  name: string;
  icon: ReactNode;
  id: number;
  href?: string;
}

export type LinkItemsFunction = (user: User) => Array<LinkItemProps>;

export const linkItems: LinkItemsFunction = (user: Maybe<User>) => {
  if (!user) return [];

  const commonLinks = [
    { id: 10, name: 'Dashboard', icon: <ProfileIcon />, href: ROUTE_DASHBOARD },
    { id: 1, name: 'Profile', icon: <ProfileIcon />, href: ROUTE_PROFILE },
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
        { id: 8, name: 'Subjects', icon: <SubjectsIcon />, href: ROUTE_SUBJECTS },
        commonLinks[1],
      ];
    case UserRoleEnum.TEACHER:
    case UserRoleEnum.STUDENT:
    default:
      return commonLinks;
  }
};

export const LOGOUT_ID = 9;
