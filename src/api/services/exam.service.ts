import { LanguageTypeEnum } from '@prisma/client';
import {
  ExamDataModel,
  ExamListModel,
  ExamTranslation,
  FirstTestQuestionModel,
  GetAllStudentExamResult,
  GetExamDurationInfoModel,
  GetExamResultsModel,
  TestQuestion,
} from '@/utils/models/exam';
import {
  CreateExamValidation,
  FinishExamValidation,
  OptionalExamValidation,
  UpdateExamStatusValidation,
} from '@/utils/validation/exam';
import $apiClient from '../axiosClient';
import { QueryParams } from '../types/common';

export class ExamService {
  static list(params?: QueryParams) {
    return $apiClient.get<ExamListModel>('/exams/list', { params });
  }

  static getExamById(id: string): Promise<ExamDataModel> {
    return $apiClient.get(`/exams/${id}`);
  }
  static async getExamTranslation(examId: string, language: LanguageTypeEnum) {
    return $apiClient.get<ExamTranslation>(`/exams/translation/${examId}/${language}`);
  }

  static createExamTranslation(
    examId: string,
    language: LanguageTypeEnum,
    input: OptionalExamValidation,
  ) {
    return $apiClient.post(`/exams/translation/${examId}/${language}`, input);
  }

  static getExamTestQuestion(examId: string, testQuestionId: string) {
    return $apiClient.get<TestQuestion>(`/exams/${examId}/test-question/${testQuestionId}`);
  }

  static async updateExamTranslation(
    examId: string,
    language: LanguageTypeEnum,
    input: OptionalExamValidation,
  ) {
    return $apiClient.patch(`/exams/translation/${examId}/${language}`, input);
  }
  // /translation/:examId/:language
  static createExam(input: CreateExamValidation) {
    return $apiClient.post('/exams', input);
  }

  static deleteExamById(id: string) {
    return $apiClient.delete(`/exams/${id}`);
  }

  static getFirstTestQuestionByExamTrId(examTrId: string) {
    return $apiClient.get<FirstTestQuestionModel>(`exams/exam-translation/${examTrId}`);
  }

  static createStudentAnswer(examId: string, testId: string, input: Array<string | undefined>) {
    return $apiClient.post(`/exams/${examId}/exam-student-answer/${testId}`, input);
  }
  static updateExamStatus(id: string, input: UpdateExamStatusValidation) {
    return $apiClient.patch<boolean>(`exams/${id}`, input);
  }

  static createStudentUuid(examId: string) {
    return $apiClient.post<{ uniqueId: string }>(`exams/${examId}`);
  }
  static finishExam(input: FinishExamValidation) {
    return $apiClient.post(`/exams/finish/${input.examId}`);
  }
  static getResults(examId: string) {
    return $apiClient.get<GetExamResultsModel>(`/exams/results/${examId}`);
  }

  static getExamDurationInfo(examId: string) {
    return $apiClient.get<GetExamDurationInfoModel>(`/exams/${examId}/duration`);
  }
  static getAllStudentsExamResult(examId: string) {
    return $apiClient.get<GetAllStudentExamResult>(`/exams/${examId}/results`);
  }
}
