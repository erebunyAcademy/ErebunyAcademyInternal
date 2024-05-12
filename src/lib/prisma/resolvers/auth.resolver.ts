import { AttachmentTypeEnum, UserRoleEnum } from '@prisma/client';
import bcrypt from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from 'next-api-decorators';
import { User } from 'next-auth';
import { ERROR_MESSAGES } from '@/utils/constants/common';
import { Maybe } from '@/utils/models/common';
import {
  ForgotPasswordStep1Validation,
  ForgotPasswordStep2Validation,
  ForgotPasswordStep3Validation,
  ResendEmailValidation,
  StudentSignUpValidation,
  TeacherSignUpValidation,
} from '@/utils/validation';
import { UserResolver } from './user.resolver';
import prisma from '..';
import { Email } from '../services/Sendgrid.service';
import { generateRandomNumber } from '../utils/common';

const createUser = async (
  input: TeacherSignUpValidation | StudentSignUpValidation, // Use union type here
  role: UserRoleEnum,
) => {
  const { email, firstName, lastName, password } = input;
  const existingUser = await prisma.user.findUnique({ where: { email } });

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

    await prisma.teacher.create({
      data: {
        profession: input.profession,
        workPlace: input.workPlace,
        scientificActivity: input.scientificActivity,
        userId: user.id,
      },
    });

    if (user.confirmationCode && user.firstName) {
      Email.sendConfirmationCodeEmail(user.email, user.confirmationCode, user.firstName)
        .then(res => console.log({ res }))
        .catch(err => console.log({ err }));
    }

    return user;
  }

  static async studentSignUp(input: StudentSignUpValidation) {
    const { facultyId, studentGradeGroupId, studentGradeId, attachment } = input;

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
        studentGradeId,
        studentGradeGroupId,
      },
    });

    if (user.confirmationCode && user.firstName) {
      Email.sendConfirmationCodeEmail(user.email, user.confirmationCode, user.firstName)
        .then(res => console.log({ res }))
        .catch(err => console.log({ err }));
    }

    return user;
  }
  static async signin(email: string, password: string) {
    try {
      const user: Maybe<User> = await UserResolver.findUserByEmail(email);

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
    const user: Maybe<User> = await UserResolver.findUserByEmail(email);

    if (!user) {
      throw new BadRequestException(ERROR_MESSAGES.userNotFound);
    }

    const confirmationCode = generateRandomNumber(4);

    await Email.sendForgotPasswordEmail(user.email, confirmationCode, user.firstName)
      .then(res => console.log({ res }))
      .catch(err => console.log({ err }));

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
      data: { password: hashedPassword },
    });

    return !!updatedUser;
  }

  static async resendEmail(data: ResendEmailValidation) {
    const { email, firstName } = data;
    const confirmationCode = generateRandomNumber(6);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('User with provided email does not exist');
    }

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        confirmationCode,
      },
    });

    await Email.sendConfirmationCodeEmail(email, confirmationCode, firstName);

    return true;
  }
}
