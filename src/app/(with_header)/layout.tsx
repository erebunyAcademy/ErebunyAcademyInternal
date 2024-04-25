import { Header } from "@/components/organisms";
import { serverSession } from "@/pages/api/auth/[...nextauth]";

export default async function HeaderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await serverSession();
  return (
    <>
      <Header user={session?.user} />
      {children}
    </>
  );
}
