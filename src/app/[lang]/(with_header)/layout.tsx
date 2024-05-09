import { ReactNode } from 'react';
import { Header } from '@/components/organisms';
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
      <Header user={session?.user} lang={params.lang} linkItems={linkItems(session?.user)} />
      {children}
    </>
  );
}
