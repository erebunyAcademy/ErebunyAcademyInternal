import { User } from '@prisma/client';
import { serverSession } from '@/pages/api/auth/[...nextauth]';

export interface UserModel extends User {}

export type SessionUser = ReturnType<typeof serverSession>;
