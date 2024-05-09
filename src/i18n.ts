import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const i18n = {
  defaultLocale: 'am',
  locales: ['en', 'ru', 'am'],
};

export const languages: Record<Locale, string> = {
  en: 'En',
  ru: 'Рус',
  am: 'Հայ',
};

export type Locale = 'en' | 'ru' | 'am';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!i18n.locales.includes(locale as string)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
