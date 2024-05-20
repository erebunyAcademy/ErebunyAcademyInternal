import { ReactNode } from 'react';
import { Flex } from '@chakra-ui/react';
import SidebarContent from '@/components/molecules/SidebarContent';
import { Locale } from '@/i18n';
import { serverSession } from '@/pages/api/auth/[...nextauth]';
import { linkItems } from '@/utils/helpers/permissionRoutes';

export default async function HeaderLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: { lang: Locale };
}>) {
  const session = await serverSession();

  return (
    <>
      <SidebarContent
        display={{ base: 'none', md: 'block' }}
        width="360px"
        linkItems={linkItems(session?.user || null)}
        lang={params.lang}
      />
      <Flex marginLeft={{ base: 0, md: '360px' }} marginTop="60px">
        {children}
      </Flex>
    </>
  );
}
