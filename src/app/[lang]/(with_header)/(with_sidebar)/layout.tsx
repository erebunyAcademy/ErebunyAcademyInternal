import { ReactNode } from 'react';
import { Flex } from '@chakra-ui/react';
import SidebarContent from '@/components/molecules/SidebarContent';
import { serverSession } from '@/pages/api/auth/[...nextauth]';
import { linkItems } from '@/utils/helpers/permissionRoutes';

export default async function HeaderLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await serverSession();

  return (
    <>
      <SidebarContent
        display={{ base: 'none', md: 'block' }}
        width="360px"
        linkItems={linkItems(session?.user || null)}
      />
      <Flex marginLeft={{ base: 0, md: '360px' }} marginTop="60px">
        {children}
      </Flex>
    </>
  );
}
