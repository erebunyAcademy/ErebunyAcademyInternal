'use client';
import { useMemo } from 'react';
import { StackProps } from '@chakra-ui/react';
import { AuthBox } from '@/components/molecules';
import { useAuth } from '@/contexts/AuthContext';
import { Locale } from '@/i18n';
import { ROUTE_FORGOT_PASSWORD } from '@/utils/constants/routes';
import { languagePathHelper } from '@/utils/helpers/language';
import { Step1, Step2, Step3 } from './steps';

export default function ForgotPasswrodPage({ params }: { params: { lang: Locale } }) {
  const { step } = useAuth();

  const Step = useMemo(() => {
    switch (step) {
      case 'emailStep':
        return <Step1 />;
      case 'OTPStep':
        return <Step2 />;
      case 'passwordStep':
        return <Step3 lang={params.lang} />;
      default:
        return null;
    }
  }, [step]);

  const authBoxData = useMemo(() => {
    switch (step) {
      case 'emailStep':
        return {
          href: languagePathHelper(params.lang, ROUTE_FORGOT_PASSWORD),
          title: 'forgotPassword',
        };
      case 'OTPStep':
        return {
          href: languagePathHelper(params.lang, ROUTE_FORGOT_PASSWORD),
          title: 'checkYourEmail',
        };
      case 'passwordStep':
        return {
          href: languagePathHelper(params.lang, ROUTE_FORGOT_PASSWORD),
          title: 'createNewPassword',
        };
    }
  }, [params.lang, step]);

  const authBoxProps = useMemo(
    () => ({
      data: [authBoxData],
      boxProps: { marginTop: { base: 64, md: 160, '2xl': 210 } },
    }),
    [authBoxData],
  );

  const linkProps: StackProps = useMemo(() => {
    switch (step) {
      case 'OTPStep':
        return { display: 'flex', justifyContent: 'center' };
      default:
        return {};
    }
  }, [step]);

  return (
    <AuthBox data={authBoxProps.data} boxProps={authBoxProps.boxProps} linkProps={linkProps}>
      {Step}
    </AuthBox>
  );
}
