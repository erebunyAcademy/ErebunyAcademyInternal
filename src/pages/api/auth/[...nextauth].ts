import { UnauthorizedException } from 'next-api-decorators';
import NextAuth, { AuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthResolver } from '@/lib/prisma/resolvers/auth.resolver';
import { UserResolver } from '@/lib/prisma/resolvers/user.resolver';

export const authOptions: AuthOptions = {
  secret: process.env.JWT_SECRET,
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { type: 'text' },
        password: { type: 'password' },
      },
      authorize: async credentials =>
        AuthResolver.signin(credentials?.email || '', credentials?.password || ''),
    }),
  ],
  callbacks: {
    session: async ({ session }) => {
      const user = await UserResolver.findUserWithEmail(session.user?.email || '');
      if (!user) {
        throw new UnauthorizedException();
      }
      return { ...session, user };
    },
    jwt: async ({ token }) => {
      const user = await UserResolver.findUserWithEmail(token.email || '');
      if (!user) {
        throw new UnauthorizedException();
      }
      return token;
    },
  },

  pages: { signIn: '/signin', error: '/signin' },
  session: { strategy: 'jwt' },
};

export const serverSession = () => {
  try {
    return getServerSession(authOptions);
  } catch (e) {
    throw e;
  }
};

export default NextAuth(authOptions);
