import { Exam, Prisma } from '@prisma/client';
import { ExamsResolver } from '@/lib/prisma/resolvers/exam.resolver';

export type ExamListModel = Prisma.PromiseReturnType<typeof ExamsResolver.list>;

export type ExamDataListModel = Awaited<ReturnType<typeof ExamsResolver.list>>['exams'];

export type ExamModel = ExamDataListModel extends (infer SingleType)[] ? SingleType : never;

export type ExamDataModel = Prisma.PromiseReturnType<typeof ExamsResolver.getExamDataById>;

export type ExamTranslation = Prisma.PromiseReturnType<
  typeof ExamsResolver.getExamTranslationByExamIdAndLanguage
>;

export interface FacultyModel extends Exam {}

export const initialState = {
  questionColumnName: '',
  optionsColumnName: '',
  answerColumnName: '',
  levelColumnName: '',
  categoryColumnName: '',
  topicColumnName: '',
  subtopicColumnName: '',
};

export type State = typeof initialState;

export type ExamColumnNamesType = keyof State;

export type ExcelReducerActions = { type: ExamColumnNamesType; payload: string };

export enum EXAM_FIELD_KEY {
  question = 'question',
  options = 'options',
  answers = 'answers',
  level = 'level',
  category = 'category',
  topic = 'topic',
  subtopic = 'subtopic',
}

export type TestQuestion = Prisma.PromiseReturnType<typeof ExamsResolver.getTestQuestion>;

export type GetExamTranslationModel = Prisma.PromiseReturnType<
  typeof ExamsResolver.getExamTranslationByExamId
>;

export type FirstTestQuestionModel = Prisma.PromiseReturnType<
  typeof ExamsResolver.getFirstTestQuestion
>;

export type GetExamResultsModel = Prisma.PromiseReturnType<typeof ExamsResolver.getResults>;

export type GetExamDurationInfoModel = Prisma.PromiseReturnType<
  typeof ExamsResolver.getExamDurationInfo
>;

export type GetAllStudentExamResult = Prisma.PromiseReturnType<
  typeof ExamsResolver.getStudentsExamResults
>;

export type GetStudentExamResult = GetAllStudentExamResult extends (infer SingleType)[]
  ? SingleType
  : never;
