import { UserRoleEnum } from '@prisma/client';
import bcrypt from 'bcrypt';
import { BadRequestException } from 'next-api-decorators';
import { ERROR_MESSAGES } from '@/utils/constants/common';
import { StudentSignUpValidation, TeacherSignUpValidation } from '@/utils/validation';
import prisma from '..';
import { Email } from '../services/Sendgrid.service';
import { generateRandomNumber } from '../utils/common';

const createUser = async (email: string, password: string, role: UserRoleEnum) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new BadRequestException(ERROR_MESSAGES.userAlreadyExists);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const confirmationCode = generateRandomNumber(6);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, confirmationCode, role },
  });

  return user;
};

export class AuthResolver {
  static async teacherSignUp(input: TeacherSignUpValidation) {
    const { email, password, ...rest } = input;

    const user = await createUser(email, password, 'TEACHER');

    await prisma.teacher.create({
      data: {
        profession: rest.profession,
        workPlace: rest.workPlace,
        scientificActivity: rest.scientificActivity,
        user: { connect: { id: user.id } },
      },
    });

    if (user.confirmationCode && user.firstName) {
      Email.sendConfirmationCodeEmail(user.email, user.confirmationCode, rest.firstName)
        .then(res => console.log({ res }))
        .catch(err => console.log({ err }));
    }

    return user;
  }

  static async studentSignUp(input: StudentSignUpValidation) {
    const { email, password } = input;

    const user = await createUser(email, password, 'STUDENT');

    await prisma.student.create({
      data: {
        // need to add data
        user: { connect: { id: user.id } },
      },
    });

    if (user.confirmationCode && user.firstName) {
      Email.sendConfirmationCodeEmail(user.email, user.confirmationCode, user.firstName)
        .then(res => console.log({ res }))
        .catch(err => console.log({ err }));
    }

    return user;
  }
}
