import { Suspense } from 'react';
import { AuthWrapper } from '@/components/organisms';
import { AuthProvider } from '@/contexts/AuthContext';
import { Locale } from '@/i18n';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthWrapper>
        <Suspense>{children}</Suspense>
      </AuthWrapper>
    </AuthProvider>
  );
}
