import { ReactNode } from 'react';
import { Flex } from '@chakra-ui/react';
import { redirect } from 'next/navigation';
import SidebarContent from '@/components/molecules/SidebarContent';
import { Header } from '@/components/organisms';
import { serverSession } from '@/pages/api/auth/[...nextauth]';
import { linkItems } from '@/utils/helpers/permissionRoutes';

export default async function HeaderLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await serverSession();

  if (!session) {
    redirect('/signin');
  }

  return (
    <>
      <Header user={session?.user} linkItems={linkItems(session.user)} />
      <SidebarContent
        display={{ base: 'none', md: 'block' }}
        width="360px"
        linkItems={linkItems(session.user)}
      />
      <Flex marginLeft={{ base: 0, md: '360px' }}>{children}</Flex>
    </>
  );
}
