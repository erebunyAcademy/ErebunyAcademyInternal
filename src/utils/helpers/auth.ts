import { Locale } from '@/i18n';
import { languagePathHelper } from './language';
import { ROUTE_SIGN_IN, ROUTE_SIGN_UP } from '../constants/routes';

export const authBoxProps = (lng: Locale) => ({
  data: [
    { href: languagePathHelper(lng, ROUTE_SIGN_UP), title: 'signUp' },
    { href: languagePathHelper(lng, ROUTE_SIGN_IN), title: 'signIn' },
  ],
  boxProps: { marginTop: { base: 64, md: 37 } },
});
