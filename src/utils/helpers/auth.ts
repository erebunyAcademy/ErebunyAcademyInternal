import { Locale } from '@/i18n';
import { languagePathHelper } from './language';
import { SIGN_IN_ROUTE, SIGN_UP_ROUTE } from '../constants/routes';

export const authBoxProps = (lng: Locale) => ({
  data: [
    { href: languagePathHelper(lng, SIGN_UP_ROUTE), title: 'signUp' },
    { href: languagePathHelper(lng, SIGN_IN_ROUTE), title: 'signIn' },
  ],
  boxProps: { marginTop: { base: 64, md: 37 } },
});
