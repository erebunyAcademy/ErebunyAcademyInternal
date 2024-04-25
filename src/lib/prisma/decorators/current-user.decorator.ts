import { createParamDecorator, UnauthorizedException } from 'next-api-decorators';
import { getToken } from 'next-auth/jwt';
import { UserResolver } from '../resolvers';

export const CurrentUser = createParamDecorator(async req => {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  if (!token?.email) {
    throw new UnauthorizedException();
  }

  const user = await UserResolver.findUserWithEmail(token.email);

  if (!user) {
    throw new UnauthorizedException();
  }

  return user;
});
