'use client';
import { useMemo } from 'react';
import { StackProps } from '@chakra-ui/react';
import { AuthBox } from '@/components/molecules';
import { useAuth } from '@/contexts/AuthContext';
import { FORGOT_PASSWORD_ROUTE } from '@/utils/constants/routes';
import { Step1, Step2, Step3 } from './steps';

export default function ForgotPasswrodPage() {
  const { step } = useAuth();

  const Step = useMemo(() => {
    switch (step) {
      case 'emailStep':
        return <Step1 />;
      case 'OTPStep':
        return <Step2 />;
      case 'passwordStep':
        return <Step3 />;
      default:
        return null;
    }
  }, [step]);

  const authBoxData = useMemo(() => {
    switch (step) {
      case 'emailStep':
        return {
          href: FORGOT_PASSWORD_ROUTE,
          title: 'Forgot Password?',
        };
      case 'OTPStep':
        return {
          href: FORGOT_PASSWORD_ROUTE,
          title: 'Check your email',
        };
      case 'passwordStep':
        return {
          href: FORGOT_PASSWORD_ROUTE,
          title: 'Create new password',
        };
    }
  }, [step]);

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
