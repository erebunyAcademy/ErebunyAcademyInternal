import { Body, Catch, createHandler, Get, Post, Query, ValidationPipe } from 'next-api-decorators';
import { SortingType } from '@/api/types/common';
import { exceptionHandler } from '@/lib/prisma/error';
import { AuthResolver } from '@/lib/prisma/resolvers/auth.resolver';
import { UserResolver } from '@/lib/prisma/resolvers/user.resolver';
import { StudentSignUpValidation, TeacherSignUpValidation } from '@/utils/validation';
import { GetPresignedUrlInput } from '@/utils/validation/user';

@Catch(exceptionHandler)
class UserHandler {
  @Get('/list')
  _getAllUsers(
    @Query('offset') skip: string,
    @Query('limit') take: string,
    @Query('search') search: string,
    @Query('sorting') sorting: SortingType[],
  ) {
    return UserResolver.list(+skip, +take, search, sorting);
  }

  @Post('/student-signup')
  _studentSignUp(@Body(ValidationPipe) body: StudentSignUpValidation) {
    return AuthResolver.studentSignUp(body);
  }

  @Post('/teacher-signup')
  _teacherSignUp(@Body(ValidationPipe) body: TeacherSignUpValidation) {
    return AuthResolver.teacherSignUp(body);
  }

  @Post('/get-presigned-url')
  _getPreSignedUrl(@Body(ValidationPipe) input: GetPresignedUrlInput) {
    return UserResolver.getPreSignedUrl(input);
  }
}

export default createHandler(UserHandler);
