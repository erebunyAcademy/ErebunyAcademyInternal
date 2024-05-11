import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { AuthWrapper } from '@/components/organisms';
import { AuthProvider } from '@/contexts/AuthContext';
import { Locale } from '@/i18n';
import { serverSession } from '@/pages/api/auth/[...nextauth]';
import { ROUTE_DASHBOARD } from '@/utils/constants/routes';
import { languagePathHelper } from '@/utils/helpers/language';

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const session = await serverSession();

  if (session?.user) {
    redirect(languagePathHelper(params.lang, ROUTE_DASHBOARD));
  }

  return (
    <AuthProvider>
      <AuthWrapper>
        <Suspense>{children}</Suspense>
      </AuthWrapper>
    </AuthProvider>
  );
}
