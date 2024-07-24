import { ReactNode } from 'react';
import { UserRoleEnum } from '@prisma/client';
import { User } from 'next-auth';
import CourseGroupIcon from '@/icons/course_group_icon.svg';
import CourseIcon from '@/icons/course_icon.svg';
import DashboardIcon from '@/icons/dashboard-icon.svg';
import ExamsIcon from '@/icons/exam_icon.svg';
import FacultiesIcon from '@/icons/faculty_icon.svg';
import LogoutIcon from '@/icons/log-out.svg';
import ProfileIcon from '@/icons/profile.svg';
import ScheduleIcon from '@/icons/schedule.svg';
import StudentIcon from '@/icons/student_icon.svg';
import SubjectsIcon from '@/icons/subjects_icon.svg';
import TeacherIcon from '@/icons/teacher_icon.svg';
import {
  ROUTE_COURSE,
  ROUTE_COURSE_GROUP,
  ROUTE_DASHBOARD,
  ROUTE_EXAMS,
  ROUTE_FACULTIES,
  ROUTE_PROFILE,
  ROUTE_SCHEDULES,
  ROUTE_STUDENT_EXAM_LIST,
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
  isExpandable?: boolean;
  children?: any[];
}

export type LinkItemsFunction = (user: User) => Array<LinkItemProps>;

export const linkItems: LinkItemsFunction = (user: Maybe<User>) => {
  if (!user) return [];

  const commonLinks = [
    { id: 10, name: 'dashboard', icon: <DashboardIcon />, href: ROUTE_DASHBOARD },
    { id: 1, name: 'profile', icon: <ProfileIcon />, href: ROUTE_PROFILE },
    { id: 9, name: 'logout', icon: <LogoutIcon /> },
  ];

  switch (user.role) {
    case UserRoleEnum.ADMIN:
      return [
        ...commonLinks.slice(0, 2),
        { id: 2, name: 'faculty', icon: <FacultiesIcon />, href: ROUTE_FACULTIES },
        { id: 3, name: 'students', icon: <StudentIcon />, href: ROUTE_STUDENTS },
        { id: 4, name: 'course', icon: <CourseIcon />, href: ROUTE_COURSE },
        {
          id: 5,
          name: 'courseGroup',
          icon: <CourseGroupIcon />,
          href: ROUTE_COURSE_GROUP,
        },
        { id: 6, name: 'exams', icon: <ExamsIcon />, href: ROUTE_EXAMS },
        { id: 7, name: 'teachers', icon: <TeacherIcon />, href: ROUTE_TEACHERS },
        { id: 8, name: 'subjects', icon: <SubjectsIcon />, href: ROUTE_SUBJECTS },
        {
          id: 118,
          name: 'schedules',
          icon: <ScheduleIcon />,
          isExpandable: true,
          href: '',
          children: [
            { id: 111, name: 'cyclic', icon: <TeacherIcon />, href: `${ROUTE_SCHEDULES}/cyclic` },
            {
              id: 122,
              name: 'notCyclic',
              icon: <SubjectsIcon />,
              href: `${ROUTE_SCHEDULES}/no-cyclic`,
            },
          ],
        },
        commonLinks[2],
      ];
    case UserRoleEnum.STUDENT:
      return [
        ...commonLinks.slice(0, 2),
        { id: 6, name: 'examination', icon: <ExamsIcon />, href: ROUTE_STUDENT_EXAM_LIST },
        commonLinks[2],
      ];

    case UserRoleEnum.TEACHER:
    default:
      return commonLinks;
  }
};

export const LOGOUT_ID = 9;
