import { ReactNode } from 'react';
import { Flex } from '@chakra-ui/react';
import { UserRoleEnum } from '@prisma/client';
import { redirect } from 'next/navigation';
import { Locale } from '@/i18n';
import { serverSession } from '@/pages/api/auth/[...nextauth]';
import { ROUTE_DASHBOARD } from '@/utils/constants/routes';
import { languagePathHelper } from '@/utils/helpers/language';

export default async function StudentLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: { lang: Locale };
}>) {
  const session = await serverSession();

  if (session?.user && session?.user.role !== UserRoleEnum.STUDENT) {
    redirect(languagePathHelper(params.lang, ROUTE_DASHBOARD));
  }

  return (
    <>
      <Flex marginLeft={{ base: 0, md: '360px' }} marginTop="60px">
        {children}
      </Flex>
    </>
  );
}
