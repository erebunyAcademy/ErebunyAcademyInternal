const PClient = require('@prisma/client');
const bcrypt = require('bcrypt');

const { PrismaClient } = PClient;
const prisma = new PrismaClient();
const migration = async () => {
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS, 10);

  const user = await prisma.user.create({
    data: {
      firstName: 'abcd',
      lastName: 'efgh',
      email: 'abcd@mailinator.com',
      isVerified: true,
      password: hashedPassword,
      isAdminVerified: true,
      role: PClient.UserRoleEnum.ADMIN,
    },
  });

  await prisma.admin.create({
    data: {
      role: PClient.AdminRoleEnum.SYS_ADMIN,
      userId: user.id,
    },
  });
};
migration().then(
  () => {
    console.log('Success');
    process.exit(1);
  },
  e => {
    console.log(e.message);
    process.exit(2);
  },
);
