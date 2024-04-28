import { Body, Catch, createHandler, Post, ValidationPipe } from 'next-api-decorators';
import { exceptionHandler } from '@/lib/prisma/error';
import { AuthResolver } from '@/lib/prisma/resolvers/auth.resolver';
import { StudentSignUpValidation, TeacherSignUpValidation } from '@/utils/validation';

@Catch(exceptionHandler)
class AuthHandler {
  @Post('/student-signup')
  _studentSignUp(@Body(ValidationPipe) body: StudentSignUpValidation) {
    return AuthResolver.studentSignUp(body);
  }

  @Post('/teacher-signup')
  _teacherSignUp(@Body(ValidationPipe) body: TeacherSignUpValidation) {
    return AuthResolver.teacherSignUp(body);
  }
}

export default createHandler(AuthHandler);
