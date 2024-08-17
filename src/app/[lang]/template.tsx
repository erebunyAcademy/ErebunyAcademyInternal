import { ReactNode, Suspense } from 'react';

const Template = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => <Suspense>{children}</Suspense>;

export default Template;
