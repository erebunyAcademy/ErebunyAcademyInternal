import { Body, Catch, createHandler, Post, ValidationPipe } from 'next-api-decorators';
import { exceptionHandler } from '@/lib/prisma/error';
import { AuthResolver } from '@/lib/prisma/resolvers/auth.resolver';
import {
  ForgotPasswordStep1Validation,
  ForgotPasswordStep2Validation,
  ForgotPasswordStep3Validation,
  ResendEmailValidation,
  StudentSignUpValidation,
  TeacherSignUpValidation,
} from '@/utils/validation';

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

  @Post('/forgot-password-first-step')
  _forgotPasswordStep1(@Body(ValidationPipe) body: ForgotPasswordStep1Validation) {
    return AuthResolver.forgotPasswordStep1(body);
  }
  @Post('/forgot-password-second-step')
  _forgotPasswordStep2(@Body(ValidationPipe) body: ForgotPasswordStep2Validation) {
    return AuthResolver.forgotPasswordStep2(body);
  }
  @Post('/forgot-password-third-step')
  _forgotPasswordStep3(@Body(ValidationPipe) body: ForgotPasswordStep3Validation) {
    return AuthResolver.forgotPasswordStep3(body);
  }

  @Post('/resend-email')
  _resendEmail(@Body(ValidationPipe) body: ResendEmailValidation) {
    return AuthResolver.resendEmail(body);
  }
}

export default createHandler(AuthHandler);
