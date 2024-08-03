import { Prisma } from '@prisma/client';
import { AcademicRegisterResolver } from '@/lib/prisma/resolvers/academic-register.resolver';

export type CyclicAcademicRegisterList = Prisma.PromiseReturnType<
  typeof AcademicRegisterResolver.cycliclist
>;

export type NotCyclicAcademicRegisterList = Prisma.PromiseReturnType<
  typeof AcademicRegisterResolver.notCycliclist
>;

export type CyclicAcademicRegisterById = Prisma.PromiseReturnType<
  typeof AcademicRegisterResolver.getCyclicRegisterById
>;

export type NotCyclicAcademicRegisterById = Prisma.PromiseReturnType<
  typeof AcademicRegisterResolver.getNonCyclicRegisterById
>;
