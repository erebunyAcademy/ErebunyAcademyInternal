import { Catch, createHandler, Get, Param } from 'next-api-decorators';
import { exceptionHandler } from '@/lib/prisma/error';
import { TestQuestionResolver } from '@/lib/prisma/resolvers/test-question.resolver';

@Catch(exceptionHandler)
class TestQuestionHandler {
  @Get('/subject/:subjectId')
  _getTestQuestionBySubjectId(@Param('subjectId') subjectId: string) {
    return TestQuestionResolver.getTestQuestionsBySubjectId(subjectId);
  }
}

export default createHandler(TestQuestionHandler);
