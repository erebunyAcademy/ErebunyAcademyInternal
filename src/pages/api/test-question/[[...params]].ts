import { LanguageTypeEnum } from '@prisma/client';
import { Body, Catch, createHandler, Get, Param, Post, ValidationPipe } from 'next-api-decorators';
import { exceptionHandler } from '@/lib/prisma/error';
import { AdminGuard } from '@/lib/prisma/guards/admin';
import { TestQuestionResolver } from '@/lib/prisma/resolvers/test-question.resolver';
import { TestQuestionValidation } from '@/utils/validation/exam';

@Catch(exceptionHandler)
class TestQuestionHandler {
  @AdminGuard()
  @Get('/subject/:subjectId/:language')
  _getTestQuestionBySubjectId(
    @Param('subjectId') subjectId: string,
    @Param('language') language: LanguageTypeEnum,
  ) {
    return TestQuestionResolver.getTestQuestionsBySubjectId(subjectId, language);
  }

  @AdminGuard()
  @Post('/create/:subjectId')
  create(
    @Body(ValidationPipe) body: TestQuestionValidation,
    @Param('subjectId') subjectId: string,
  ) {
    return TestQuestionResolver.create(body, subjectId);
  }
}

export default createHandler(TestQuestionHandler);
