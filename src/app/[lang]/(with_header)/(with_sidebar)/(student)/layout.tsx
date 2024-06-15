import { redirect } from 'next/navigation';
import { Locale } from '@/i18n';
import { serverSession } from '@/pages/api/auth/[...nextauth]';
import { ROUTE_DASHBOARD } from '@/utils/constants/routes';
import { languagePathHelper } from '@/utils/helpers/language';

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: Locale };
}>) {
  const session = await serverSession();

  if (session?.user?.role !== 'STUDENT') {
    redirect(languagePathHelper(params.lang, ROUTE_DASHBOARD));
  }

  return children;
}
