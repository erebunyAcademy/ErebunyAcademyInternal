import { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import { UserRoleEnum } from '@prisma/client';
import { redirect } from 'next/navigation';
import { Header } from '@/components/organisms';
import Sidebar from '@/components/organisms/Sidebar';
import { serverSession } from '@/pages/api/auth/[...nextauth]';
import { adminLinkItems, studentLinkItems, teacherLinkItems } from '@/utils/helpers/sidebar';

export default async function HeaderLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await serverSession();

  if (!session) {
    redirect('/signin');
  }

  const linkItems = () => {
    switch (session?.user.role) {
      case UserRoleEnum.ADMIN:
        return adminLinkItems(session.user);
      case UserRoleEnum.STUDENT:
        return studentLinkItems(session.user);
      case UserRoleEnum.TEACHER:
        return teacherLinkItems(session.user);
      default:
        return studentLinkItems(session.user);
    }
  };

  return (
    <>
      <Header user={session?.user} />
      <Box marginTop="60px">
        <Sidebar linkItems={linkItems()}>{children}</Sidebar>
      </Box>
    </>
  );
}
