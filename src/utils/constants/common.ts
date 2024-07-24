import { ScheduleExamTypeEnum, WeekDayEnum } from '@prisma/client';

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

export const weekendDayList = Object.values(WeekDayEnum).map((weekendDay: WeekDayEnum) => ({
  id: weekendDay,
  title: weekendDay,
}));

export const periodListData = Array.from({ length: 10 }, (_, i) => ({
  id: `${i + 1}-${i + 2}`,
  title: `${i + 1}-${i + 2}`,
}));
