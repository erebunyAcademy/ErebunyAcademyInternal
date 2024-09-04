import { AttachmentTypeEnum, UserRoleEnum } from '@prisma/client';
import bcrypt from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from 'next-api-decorators';
import { ERROR_MESSAGES } from '@/utils/constants/common';
import {
  ForgotPasswordStep1Validation,
  ForgotPasswordStep2Validation,
  ForgotPasswordStep3Validation,
  StudentSignUpValidation,
  TeacherSignUpValidation,
} from '@/utils/validation';
import prisma from '..';
import { UserResolver } from './user.resolver';
import { mailService } from '../services/email/mailer.service';
import { generateRandomNumber } from '../utils/common';

const createUser = async (
  input: TeacherSignUpValidation | StudentSignUpValidation, // Use union type here
  role: UserRoleEnum,
) => {
  const { email, firstName, lastName, password } = input;
  const existingUser = await prisma.user.findUnique({ where: { email } });
  const uniqueUserId = generateRandomNumber(8);

  if (existingUser) {
    throw new BadRequestException(ERROR_MESSAGES.userAlreadyExists);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const confirmationCode = generateRandomNumber(6);

  const user = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      password: hashedPassword,
      uniqueUserId,
      confirmationCode,
      role,
      ...((input as StudentSignUpValidation).attachment?.attachmentKey
        ? {
            ...((input as StudentSignUpValidation).attachment.attachmentKey && {
              attachmentId: (input as StudentSignUpValidation).attachment.attachmentKey,
            }),
          }
        : {}),
    },
  });

  return user;
};
export class AuthResolver {
  static async teacherSignUp(input: TeacherSignUpValidation) {
    const user = await createUser(input, UserRoleEnum.TEACHER);

    const subjects = await prisma.subject.findMany({
      where: {
        id: { in: input.teachingSubjectIds },
      },
      select: { id: true },
    });

    if (subjects.length !== input.teachingSubjectIds.length) {
      throw new NotFoundException('Some of the provided subjects do not exist');
    }

    const createdTeacher = await prisma.teacher.create({
      data: {
        profession: input.profession,
        workPlace: input.workPlace,
        scientificActivity: input.scientificActivity,
        userId: user.id,
      },
      select: {
        id: true,
      },
    });

    await prisma.subjectTeacher.createMany({
      data: subjects.map(subject => ({
        teacherId: createdTeacher.id,
        subjectId: subject.id,
      })),
    });

    if (user.confirmationCode) {
      await mailService.sendVerificationEmail(user.email, user.confirmationCode, user.firstName);
      // Email.sendConfirmationCodeEmail(user.email, user.confirmationCode, user.firstName)
      //   .then(res => console.log({ res }))
      //   .catch(err => console.log({ err }));
    }

    return user;
  }

  static async studentSignUp(input: StudentSignUpValidation) {
    const { facultyId, courseId, courseGroupId, attachment } = input;

    const user = await createUser(input, UserRoleEnum.STUDENT);

    await prisma.attachment.create({
      data: {
        userId: user.id,
        mimetype: attachment.mimetype,
        type: AttachmentTypeEnum.FILE,
        title: attachment.title,
        key: attachment.key,
      },
    });

    await prisma.student.create({
      data: {
        userId: user.id,
        facultyId,
        courseId,
        courseGroupId: courseGroupId || undefined,
      },
    });

    if (user.confirmationCode) {
      // Email.sendConfirmationCodeEmail(user.email, user.confirmationCode, user.firstName)
      //   .then(res => console.log({ res }))
      //   .catch(err => console.log({ err }));
      await mailService.sendVerificationEmail(user.email, user.confirmationCode, user.firstName);
    }

    return user;
  }

  static async signin(email: string, password: string) {
    try {
      const user = await UserResolver.findUserWithEmail(email);

      if (!user) {
        throw new UnauthorizedException(ERROR_MESSAGES.invalidCredentials);
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        throw new UnauthorizedException(ERROR_MESSAGES.invalidCredentials);
      }

      if (!user.isVerified) {
        throw new ConflictException(ERROR_MESSAGES.verifyYourEmail);
      }

      if (!user.isAdminVerified) {
        throw new ConflictException(ERROR_MESSAGES.contactCollegeRepresentative);
      }

      return user;
    } catch (e) {
      throw new Error(e as string);
    }
  }

  static async forgotPasswordStep1({ email }: ForgotPasswordStep1Validation) {
    const user = await UserResolver.findUserWithEmail(email);

    if (!user) {
      throw new BadRequestException(ERROR_MESSAGES.userNotFound);
    }

    const confirmationCode = generateRandomNumber(4);

    await mailService.sendForgotPasswordEmail(user.email, confirmationCode, user.firstName);

    return prisma.user.update({ where: { email }, data: { confirmationCode } });
  }

  static async forgotPasswordStep2({ otpPassword }: ForgotPasswordStep2Validation) {
    if (isNaN(+otpPassword)) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }

    const user = await prisma.user.findUnique({
      where: { confirmationCode: +otpPassword },
    });

    if (!user) {
      throw new BadRequestException(ERROR_MESSAGES.invalidNumber);
    }

    const confirmationCode = generateRandomNumber(4);

    await prisma.user.update({
      where: {
        confirmationCode: +otpPassword,
      },
      data: {
        confirmationCode,
      },
    });

    return confirmationCode;
  }

  static async forgotPasswordStep3({
    confirmPassword,
    newPassword,
    confirmationCode,
  }: ForgotPasswordStep3Validation) {
    if (confirmPassword !== newPassword) {
      throw new BadRequestException(ERROR_MESSAGES.passwordDontMatch);
    }

    const user = await prisma.user.findUnique({ where: { confirmationCode } });

    if (!user) {
      throw new BadRequestException(ERROR_MESSAGES.somethingWentWrong);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, confirmationCode: null },
    });

    return !!updatedUser;
  }
}
