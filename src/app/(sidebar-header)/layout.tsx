import { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import { Header } from '@/components/organisms';
import Sidebar from '@/components/organisms/Sidebar';
import { serverSession } from '@/pages/api/auth/[...nextauth]';

export default async function HeaderLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await serverSession();
  return (
    <>
      <Header user={session?.user} />
      <Box marginTop="60px">
        <Sidebar>{children}</Sidebar>
      </Box>
    </>
  );
}
