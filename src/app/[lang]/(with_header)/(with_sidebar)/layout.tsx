import { ReactNode } from 'react';
import { Flex } from '@chakra-ui/react';
import { redirect } from 'next/navigation';
import SidebarContent from '@/components/molecules/SidebarContent';
import { Locale } from '@/i18n';
import { serverSession } from '@/pages/api/auth/[...nextauth]';
import { SIGN_IN_ROUTE } from '@/utils/constants/routes';
import { languagePathHelper } from '@/utils/helpers/language';
import { linkItems } from '@/utils/helpers/permissionRoutes';

export default async function HeaderLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: { lang: Locale };
}>) {
  const session = await serverSession();

  if (!session?.user) {
    redirect(languagePathHelper(params.lang, SIGN_IN_ROUTE));
  }

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
