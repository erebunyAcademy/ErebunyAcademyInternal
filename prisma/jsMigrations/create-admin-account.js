const PClient = require('@prisma/client');
const bcrypt = require('bcrypt');

const { PrismaClient } = PClient;
const prisma = new PrismaClient();

const migration = async () => {
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS, 10);

  try {
    await prisma.$transaction(async transaction => {
      const user = await transaction.user.create({
        data: {
          firstName: 'System',
          lastName: 'Admin',
          email: process.env.ADMIN_EMAIL,
          isVerified: true,
          password: hashedPassword,
          uniqueUserId: 77239701,
          isAdminVerified: true,
          role: PClient.UserRoleEnum.ADMIN,
        },
      });

      await transaction.admin.create({
        data: {
          role: PClient.AdminRoleEnum.SYS_ADMIN,
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
