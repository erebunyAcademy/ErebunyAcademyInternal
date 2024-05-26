import { Exam, Prisma } from '@prisma/client';
import { ExamsResolver } from '@/lib/prisma/resolvers/exam.resolver';

export type ExamListModel = Prisma.PromiseReturnType<typeof ExamsResolver.list>;
export type ExamDataListModel = Prisma.PromiseReturnType<typeof ExamsResolver.getExamDataById>;
export interface FacultyModel extends Exam {}

export type ExamColumnNamesType =
  | 'questionColumnName'
  | 'optionsColumnName'
  | 'answerColumnName'
  | 'levelColumnName';

export interface State {
  questionColumnName: string;
  optionsColumnName: string;
  answerColumnName: string;
  levelColumnName: string;
}

export type ExcelReducerActions = { type: ExamColumnNamesType; payload: string };

export enum EXAM_FIELD_KEY {
  question = 'question',
  options = 'options',
  answers = 'answers',
  level = 'level',
}
