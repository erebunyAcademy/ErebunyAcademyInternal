import { Prisma } from '@prisma/client';
import { UserResolver } from '@/lib/prisma/resolvers/user.resolver';

export type UserModel = {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  createdAt: Date;
};

export type UsersListModel = Prisma.PromiseReturnType<typeof UserResolver.list>;
