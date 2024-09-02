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
  ValidationPipe,
} from 'next-api-decorators';
import { User } from 'next-auth';
import { SortingType } from '@/api/types/common';
import { CurrentUser } from '@/lib/prisma/decorators/current-user.decorator';
import { exceptionHandler } from '@/lib/prisma/error';
import { AdminGuard } from '@/lib/prisma/guards/admin';
import { AuthGuard } from '@/lib/prisma/guards/auth';
import { SubjectResolver } from '@/lib/prisma/resolvers/subject.resolver';
import { CreateEditSubjectValidation } from '@/utils/validation/subject';

@Catch(exceptionHandler)
class SubjectHandler {
  @AuthGuard()
  @Get('/list')
  _list(
    @Query('offset') skip: string,
    @Query('limit') take: string,
    @Query('search') search: string,
    @Query('sorting') sorting: SortingType[],
    @CurrentUser() user: NonNullable<User>,
  ) {
    return SubjectResolver.list(user, +skip, +take, search, sorting);
  }

  @Get()
  getSubjectsSignupList() {
    return SubjectResolver.getSubjects();
  }

  @AuthGuard()
  @Get('/:id')
  getSubjectById(@Param('id') id: string) {
    return SubjectResolver.getSubjectById(id);
  }

  @AuthGuard()
  @Delete('/:id')
  deleteSubject(@Param('id') id: string) {
    return SubjectResolver.deleteSubjectById(id);
  }

  @AdminGuard()
  @Post()
  createSubject(@Body(ValidationPipe) input: CreateEditSubjectValidation) {
    return SubjectResolver.createSubject(input);
  }

  @AuthGuard()
  @Patch('/:subjectId')
  updateSubject(
    @Param('subjectId') subjectId: string,
    @Body(ValidationPipe) input: CreateEditSubjectValidation,
  ) {
    return SubjectResolver.updateSubjectById(subjectId, input);
  }
}

export default createHandler(SubjectHandler);
