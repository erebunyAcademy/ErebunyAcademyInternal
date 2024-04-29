import { AuthWrapper } from '@/components/organisms';
import { AuthProvider } from '@/contexts/AuthContext';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthWrapper>{children}</AuthWrapper>
    </AuthProvider>
  );
}
