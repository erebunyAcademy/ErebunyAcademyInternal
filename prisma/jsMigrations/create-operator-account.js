const PClient = require('@prisma/client');
const bcrypt = require('bcrypt');

const { PrismaClient } = PClient;
const prisma = new PrismaClient();

const migration = async () => {
  const hashedPassword = await bcrypt.hash(process.env.OPERATOR_PASS, 10);

  try {
    await prisma.$transaction(async transaction => {
      const user = await transaction.user.create({
        data: {
          firstName: 'System',
          lastName: 'Operator',
          email: process.env.OPERATOR_EMAIL,
          isVerified: true,
          password: hashedPassword,
          uniqueUserId: 7212441,
          isAdminVerified: true,
          role: PClient.UserRoleEnum.ADMIN,
        },
      });

      await transaction.admin.create({
        data: {
          role: PClient.AdminRoleEnum.OPERATOR,
          userId: user.id,
        },
      });
    });

    console.log('Success');
    process.exit(0);
  } catch (e) {
    console.error('Transaction failed:', e.message);
    process.exit(2);
  }
};

migration();
