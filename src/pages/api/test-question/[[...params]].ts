import { Body, Catch, createHandler, Get, Param, Post, ValidationPipe } from 'next-api-decorators';
import { exceptionHandler } from '@/lib/prisma/error';
import { TestQuestionResolver } from '@/lib/prisma/resolvers/test-question.resolver';
import { TestQuestionValidation } from '@/utils/validation/exam';

@Catch(exceptionHandler)
class TestQuestionHandler {
  @Get('/subject/:subjectId')
  _getTestQuestionBySubjectId(@Param('subjectId') subjectId: string) {
    return TestQuestionResolver.getTestQuestionsBySubjectId(subjectId);
  }

  @Post('/create/:subjectId')
  create(
    @Body(ValidationPipe) body: TestQuestionValidation,
    @Param('subjectId') subjectId?: string,
  ) {
    return TestQuestionResolver.create(body, subjectId);
  }
}

export default createHandler(TestQuestionHandler);
