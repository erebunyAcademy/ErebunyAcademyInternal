import { Box } from '@chakra-ui/react';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Box p={{ base: '16px', md: '25px' }} width="100%">
      {children}
    </Box>
  );
}
