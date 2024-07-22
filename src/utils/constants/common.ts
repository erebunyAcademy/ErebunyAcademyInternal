import { ScheduleExamTypeEnum, ScheduleTypeEnum } from '@prisma/client';

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

export const scheduleType = Object.values(ScheduleTypeEnum).map(title => ({
  id: title,
  title: title,
}));
