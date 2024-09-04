import type { Metadata } from 'next';
import { Locale } from 'next/dist/compiled/@vercel/og/satori';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EMAF',
  description: 'Erebuni Medical Academy Foundation',
};

export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: Locale };
}>) {
  return (
    <html lang={params.lang}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
