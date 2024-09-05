import { Locale } from 'next/dist/compiled/@vercel/og/satori';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Providers from '../providers';

export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: Locale };
}>) {
  const message = await getMessages();
  return (
    <NextIntlClientProvider locale={params.lang} messages={message}>
      <Providers>{children}</Providers>
    </NextIntlClientProvider>
  );
}
