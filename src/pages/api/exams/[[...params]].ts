import { Catch, createHandler, Post } from 'next-api-decorators';
import { exceptionHandler } from '@/lib/prisma/error';
import { ExamsResolver } from '@/lib/prisma/resolvers/exam.resolver';

@Catch(exceptionHandler)
class ExamsHandler {
  @Post()
  _createExam() {
    return ExamsResolver.createExam();
  }
}

export default createHandler(ExamsHandler);
