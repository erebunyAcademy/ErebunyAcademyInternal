import { NextApiRequest } from 'next';
import { LanguageTypeEnum } from '@prisma/client';
import {
  Body,
  Catch,
  createHandler,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  ValidationPipe,
} from 'next-api-decorators';
import { User } from 'next-auth';
import { SortingType } from '@/api/types/common';
import { CurrentUser } from '@/lib/prisma/decorators/current-user.decorator';
import { exceptionHandler } from '@/lib/prisma/error';
import { AdminGuard } from '@/lib/prisma/guards/admin';
import { StudentGuard } from '@/lib/prisma/guards/student';
import { ExamsResolver } from '@/lib/prisma/resolvers/exam.resolver';
import {
  CreateExamValidation,
  OptionalExamValidation,
  UpdateExamStatusValidation,
} from '@/utils/validation/exam';

@Catch(exceptionHandler)
class ExamsHandler {
  @Get('/list')
  _list(
    @Query('offset') skip: string,
    @Query('limit') take: string,
    @Query('search') search: string,
    @Query('sorting') sorting: SortingType[],
  ) {
    return ExamsResolver.list(+skip, +take, search, sorting);
  }

  @StudentGuard()
  @Get('/:id')
  _getExamById(@Param('id') id?: string) {
    return ExamsResolver.getExamDataById(id);
  }
  @Patch('/:id')
  _updateExamById(
    @Param('id') id: string,
    @Body(ValidationPipe) input: UpdateExamStatusValidation,
  ) {
    return ExamsResolver.updateExamStatus(id, input);
  }

  @AdminGuard()
  @Get('/translation/:examId/:language')
  _getExamTranslationByExamId(
    @Param('examId') examId: string,
    @Param('language') language: LanguageTypeEnum,
  ) {
    return ExamsResolver.getExamTranslationByExamIdAndLanguage(examId, language);
  }

  @AdminGuard()
  @Delete('/:examId')
  _deleteExamById(@Param('examId') examId: string) {
    return ExamsResolver.deleteExamById(examId);
  }

  @AdminGuard()
  @Patch('/translation/:examId/:language')
  _updateExamTranslationByExamId(
    @Param('examId') examId: string,
    @Param('language') language: LanguageTypeEnum,
    @Body(ValidationPipe) input: OptionalExamValidation,
  ) {
    return ExamsResolver.updateExamTranslation(examId, language, input);
  }

  @AdminGuard()
  @Post('/translation/:examId/:language')
  _createExamTranslation(
    @Param('examId') examId: string,
    @Param('language') language: LanguageTypeEnum,
    @Body(ValidationPipe) input: OptionalExamValidation,
  ) {
    return ExamsResolver.createExamTranslation(examId, language, input);
  }

  @StudentGuard()
  @Get('/test-question/:testQuestionId')
  getTestQuestion(@Param('testQuestionId') testQuestionId: string) {
    return ExamsResolver.getTestQuestion(testQuestionId);
  }

  @Post()
  _createExam(@Body(ValidationPipe) input: CreateExamValidation) {
    return ExamsResolver.createExam(input);
  }

  @StudentGuard()
  @Get('/exam-translation/:examTrId')
  getFirstTestQuestion(@Param('examTrId') examTrId: string) {
    return ExamsResolver.getFirstTestQuestion(examTrId);
  }

  @StudentGuard()
  @Get('/:examId/duration')
  getExamDurationInfo(@Param('examId') examId: string) {
    return ExamsResolver.getExamDurationInfo(examId);
  }

  @StudentGuard()
  @Post('/:examId/exam-student-answer/:testId')
  createStudentAnswer(
    @Body(ValidationPipe) input: string[],
    @CurrentUser() user: User,
    @Param('examId') examId?: string,
    @Param('testId') testId?: string,
  ) {
    return ExamsResolver.createStudentAnswer(input, user?.student?.id, examId, testId);
  }

  @StudentGuard()
  @Post('/:examId')
  createStudentExamId(
    @Param('examId') examId: string,
    @CurrentUser() user: User,
    @Req() req: NextApiRequest,
  ) {
    const studentId = user?.student?.id as string;
    return ExamsResolver.createStudentUuid(examId, studentId, req);
  }
  @Post('/finish/:examId')
  finishExam(@CurrentUser() user: User, @Param('examId') examId?: string) {
    return ExamsResolver.finishExam(user?.student?.id, examId);
  }

  @StudentGuard()
  @Get('/results/:examId')
  getExamResults(@CurrentUser() user: User, @Param('examId') examId?: string) {
    return ExamsResolver.getResults(user?.student?.id, examId);
  }
}

export default createHandler(ExamsHandler);
