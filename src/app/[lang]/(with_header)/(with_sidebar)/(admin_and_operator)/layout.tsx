import { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import { redirect } from 'next/navigation';
import { Locale } from '@/i18n';
import { serverSession } from '@/pages/api/auth/[...nextauth]';
import { ROUTE_DASHBOARD } from '@/utils/constants/routes';
import { languagePathHelper } from '@/utils/helpers/language';

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: { lang: Locale };
}>) {
  const session = await serverSession();

  if (session?.user?.admin?.role !== 'SYS_ADMIN' && session?.user?.admin?.role !== 'OPERATOR') {
    redirect(languagePathHelper(params.lang, ROUTE_DASHBOARD));
  }

  return (
    <Box p={{ base: '16px', md: '25px' }} width="100%">
      {children}
    </Box>
  );
}
