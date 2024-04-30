import { Body, Catch, createHandler, Post, ValidationPipe } from 'next-api-decorators';
import { exceptionHandler } from '@/lib/prisma/error';
import { AuthResolver } from '@/lib/prisma/resolvers/auth.resolver';
import { UserResolver } from '@/lib/prisma/resolvers/user.resolver';
import { StudentSignUpValidation, TeacherSignUpValidation } from '@/utils/validation';
import { GetPresignedUrlInput } from '@/utils/validation/user';

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

  @Post('/get-presigned-url')
  _getPreSignedUrl(@Body(ValidationPipe) input: GetPresignedUrlInput) {
    return UserResolver.getPreSignedUrl(input);
  }
}

export default createHandler(AuthHandler);
