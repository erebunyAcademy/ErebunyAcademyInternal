import { redirect } from "next/navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthWrapper } from "@/components/organisms";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AuthWrapper>{children}</AuthWrapper>
    </AuthProvider>
  );
}
