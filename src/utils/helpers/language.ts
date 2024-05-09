import { Locale } from '@/i18n';

export const languagePathHelper = (lng: Locale, pathname: string) => `/${lng}${pathname}`;
