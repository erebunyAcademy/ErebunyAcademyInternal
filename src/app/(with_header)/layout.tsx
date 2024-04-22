import { Header } from "@/components/organisms";
import { serverSession } from "../api/auth/[...nextauth]/route";

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
