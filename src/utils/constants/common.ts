import { ScheduleExamTypeEnum } from '@prisma/client';

export const ERROR_MESSAGES = {
  somethingWentWrong: 'somethingWentWrong',
  verifyYourEmail: 'verifyYourEmail',
  invalidCredentials: 'invalidCredentials',
  userAlreadyExists: 'userAlreadyExists',
  userNotFound: 'userNotFound',
  invalidNumber: 'invalidNumber',
  passwordDontMatch: 'passwordDontMatch',
  invalidPassword: 'invalidPassword',
  contactCollegeRepresentative: 'contactCollegeRepresentative',
  currentlyUsingThisPassword: 'currentlyUsingThisPassword',
  invalidCurrentPassword: 'invalidCurrentPassword',
  invalidConfirmationCode: 'invalidConfirmationCode',
  invalidUserId: 'invalidUserId',
};

export const ITEMS_PER_PAGE = 20;

export const scheduleExamType = Object.values(ScheduleExamTypeEnum).map(title => ({
  id: title,
  title: title,
}));

export enum WeekDayEnum {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export const weekendDayList = Object.values(WeekDayEnum).map(
  (weekendDay: WeekDayEnum, index: number) => ({
    id: index,
    title: weekendDay,
  }),
);

export const periodListData = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  title: `${i * 2 + 1}-${i * 2 + 2}`,
}));

export const academicYearListData = Array.from({ length: 5 }, (_, i) => ({
  id: `${new Date().getFullYear() + i}-${new Date().getFullYear() + 1 + i}`,
  title: `${new Date().getFullYear() + i}-${new Date().getFullYear() + 1 + i}`,
}));

export const markAttendantOptionData = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `${i + 1}`,
}));
