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
import RegisterIcon from '@/icons/register.svg';
import ScheduleIcon from '@/icons/schedule.svg';
import ScheduleChildrenIcon from '@/icons/schedule_.svg';
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
  ROUTE_STUDENT_ACADEMIC_REGISTER,
  ROUTE_STUDENT_EXAM_LIST,
  ROUTE_STUDENT_SCHEDULE,
  ROUTE_STUDENTS,
  ROUTE_SUBJECTS,
  ROUTE_TEACHER_SCHEDULE,
  ROUTE_TEACHERS,
} from '../constants/routes';
import { Maybe } from '../models/common';

export interface LinkItemProps {
  name: string;
  icon: ReactNode;
  id: number;
  href?: string;
  isExpandable?: boolean;
  children?: LinkItemProps[];
}

export type LinkItemsFunction = (user: User) => Array<LinkItemProps>;

const createCommonLinks = (): LinkItemProps[] => [
  { id: 10, name: 'dashboard', icon: <DashboardIcon />, href: ROUTE_DASHBOARD },
  { id: 1, name: 'profile', icon: <ProfileIcon />, href: ROUTE_PROFILE },
];

const createLogoutLink = (): LinkItemProps => ({
  id: LOGOUT_ID,
  name: 'logout',
  icon: <LogoutIcon />,
});

const createScheduleLinks = (): LinkItemProps => ({
  id: 118,
  name: 'schedules',
  icon: <ScheduleIcon />,
  isExpandable: true,
  href: '',
  children: [
    { id: 111, name: 'cyclic', icon: <ScheduleChildrenIcon />, href: `${ROUTE_SCHEDULES}/cyclic` },
    {
      id: 122,
      name: 'notCyclic',
      icon: <ScheduleChildrenIcon />,
      href: `${ROUTE_SCHEDULES}/no-cyclic`,
    },
  ],
});

const adminLinks = (isOperator: boolean): LinkItemProps[] => {
  const links = isOperator
    ? [createScheduleLinks()]
    : [
        { id: 2, name: 'faculty', icon: <FacultiesIcon />, href: ROUTE_FACULTIES },
        { id: 3, name: 'students', icon: <StudentIcon />, href: ROUTE_STUDENTS },
        { id: 4, name: 'course', icon: <CourseIcon />, href: ROUTE_COURSE },
        { id: 5, name: 'courseGroup', icon: <CourseGroupIcon />, href: ROUTE_COURSE_GROUP },
        { id: 6, name: 'exams', icon: <ExamsIcon />, href: ROUTE_EXAMS },
        { id: 7, name: 'teachers', icon: <TeacherIcon />, href: ROUTE_TEACHERS },
        { id: 8, name: 'subjects', icon: <SubjectsIcon />, href: ROUTE_SUBJECTS },
        createScheduleLinks(),
      ];

  return [...createCommonLinks(), ...links, createLogoutLink()];
};

const studentLinks = (): LinkItemProps[] => [
  ...createCommonLinks(),
  { id: 6, name: 'examination', icon: <ExamsIcon />, href: ROUTE_STUDENT_EXAM_LIST },
  { id: 33, name: 'schedule', icon: <ScheduleIcon />, href: ROUTE_STUDENT_SCHEDULE },
  {
    id: 35,
    name: 'academicRegister',
    icon: <RegisterIcon />,
    href: ROUTE_STUDENT_ACADEMIC_REGISTER,
  },
  createLogoutLink(),
];

const teacherLinks = (): LinkItemProps[] => [
  ...createCommonLinks(),
  { id: 8, name: 'subjects', icon: <SubjectsIcon />, href: ROUTE_SUBJECTS },
  { id: 34, name: 'schedule', icon: <ScheduleIcon />, href: ROUTE_TEACHER_SCHEDULE },
  createLogoutLink(),
];

export const linkItems: LinkItemsFunction = (user: Maybe<User>) => {
  if (!user) return [];

  switch (user.role) {
    case UserRoleEnum.ADMIN:
      return adminLinks(user.admin?.role === 'OPERATOR');
    case UserRoleEnum.STUDENT:
      return studentLinks();
    case UserRoleEnum.TEACHER:
      return teacherLinks();
    default:
      return [...createCommonLinks(), createLogoutLink()];
  }
};

export const LOGOUT_ID = 9;
