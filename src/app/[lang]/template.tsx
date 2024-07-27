import { Suspense } from 'react';

const Template = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => <Suspense>{children}</Suspense>;

export default Template;
