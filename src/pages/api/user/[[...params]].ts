import { Body, Catch, createHandler, Post, ValidationPipe } from 'next-api-decorators';
import { exceptionHandler } from '@/lib/prisma/error';
import { AuthResolver } from '@/lib/prisma/resolvers/auth.resolver';
import { SignUpValidation } from '@/utils/validation';

@Catch(exceptionHandler)
class AuthHandler {
  @Post('/signup')
  _signUp(@Body(ValidationPipe) input: SignUpValidation) {
    return AuthResolver.signUp(input);
  }
}

export default createHandler(AuthHandler);
