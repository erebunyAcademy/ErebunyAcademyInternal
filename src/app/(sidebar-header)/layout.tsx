import { ReactNode } from 'react';
import { Flex } from '@chakra-ui/react';
import { UserRoleEnum } from '@prisma/client';
import { redirect } from 'next/navigation';
import { Header, SimpleSidebar } from '@/components/organisms';
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
      <SimpleSidebar />
      <Flex marginLeft={{ base: 0, md: '360px' }}>{children}</Flex>
    </>
  );
}
