import { Prisma } from '@prisma/client';
import { GradeLevelResolver } from '@/lib/prisma/resolvers/grade-level.resolver';

export type GradeLevelListType = Prisma.PromiseReturnType<typeof GradeLevelResolver.list>;
