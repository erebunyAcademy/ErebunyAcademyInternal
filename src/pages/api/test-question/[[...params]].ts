import { LanguageTypeEnum } from '@prisma/client';
import { Body, Catch, createHandler, Get, Param, Post, ValidationPipe } from 'next-api-decorators';
import { exceptionHandler } from '@/lib/prisma/error';
import { AuthGuard } from '@/lib/prisma/guards/auth';
import { TestQuestionResolver } from '@/lib/prisma/resolvers/test-question.resolver';
import { TestQuestionValidation } from '@/utils/validation/exam';

@Catch(exceptionHandler)
class TestQuestionHandler {
  @AuthGuard()
  @Get('/subject/:subjectId/:language')
  _getTestQuestionBySubjectId(
    @Param('subjectId') subjectId: string,
    @Param('language') language: LanguageTypeEnum,
  ) {
    return TestQuestionResolver.getTestQuestionsBySubjectId(subjectId, language);
  }

  @AuthGuard()
  @Post('/create/:subjectId/:lang')
  create(
    @Body(ValidationPipe) body: TestQuestionValidation,
    @Param('subjectId') subjectId: string,
    @Param('lang') lang: LanguageTypeEnum,
  ) {
    return TestQuestionResolver.create(body, subjectId, lang);
  }
}

export default createHandler(TestQuestionHandler);
