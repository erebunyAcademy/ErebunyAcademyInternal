import { Body, Catch, createHandler, Get, Param, Post, ValidationPipe } from 'next-api-decorators';
import { Locale } from '@/i18n';
import { exceptionHandler } from '@/lib/prisma/error';
import { TestQuestionResolver } from '@/lib/prisma/resolvers/test-question.resolver';
import { TestQuestionValidation } from '@/utils/validation/exam';

@Catch(exceptionHandler)
class TestQuestionHandler {
  @Get('/subject/:subjectId')
  _getTestQuestionBySubjectId(@Param('subjectId') subjectId: string) {
    return TestQuestionResolver.getTestQuestionsBySubjectId(subjectId);
  }

  @Post('/create/:subjectId/:language')
  create(
    @Body(ValidationPipe) body: TestQuestionValidation,
    @Param('subjectId') subjectId: string,
    @Param('language') language: Locale,
  ) {
    return TestQuestionResolver.create(body, subjectId, language);
  }
}

export default createHandler(TestQuestionHandler);
