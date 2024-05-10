'use client';
import { useLayoutEffect } from 'react';
import { Button, Link, useToast, VStack } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import NextLink from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, SignInResponse } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { UserService } from '@/api/services/user.service';
import { FormInput, Loading } from '@/components/atoms';
import { AuthBox } from '@/components/molecules';
import { Locale } from '@/i18n';
import { ERROR_MESSAGES } from '@/utils/constants/common';
import { FORGOT_PASSWORD_ROUTE, PROFILE_ROUTE } from '@/utils/constants/routes';
import { authBoxProps } from '@/utils/helpers/auth';
import { languagePathHelper } from '@/utils/helpers/language';
import { SignInFormData } from '@/utils/models/auth';

const SignIn = ({ params }: { params: { lang: Locale } }) => {
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: { email: '', password: '', rememberMe: true },
  });

  const onSubmit: SubmitHandler<SignInFormData> = async ({ email, password }) => {
    try {
      const res: SignInResponse | undefined = await signIn('credentials', {
        email,
        password,
        callbackUrl: PROFILE_ROUTE,
        redirect: false,
      });
      if (res?.ok && res.url) {
        router.push(res.url);
        router.refresh();
      } else {
        toast({ title: res?.error, status: 'error' });
      }
    } catch (error) {
      toast({ title: ERROR_MESSAGES.invalidCredentials, status: 'error' });
    }
  };

  const { mutate } = useMutation({
    mutationFn: UserService.confirmUserEmail,
    onSuccess: () => router.replace('/signin'),
  });

  useLayoutEffect(() => {
    const code = searchParams?.get('code');
    if (code) {
      mutate(code);
    }
  }, [mutate, searchParams]);

  return (
    <AuthBox data={authBoxProps(params.lang).data} boxProps={authBoxProps(params.lang).boxProps}>
      {isSubmitting && <Loading isLoading={isSubmitting} />}
      <VStack spacing={32}>
        <Controller
          name="email"
          control={control}
          rules={{
            required: 'This field is required',
          }}
          render={({ field: { onChange, value } }) => (
            <FormInput
              isRequired
              isInvalid={!!errors.email?.message}
              name="email"
              type="email"
              formLabelName={t('user.email')}
              value={value}
              handleInputChange={onChange}
              formErrorMessage={errors.email?.message}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{
            required: 'This field is required',
          }}
          render={({ field: { onChange, value } }) => (
            <FormInput
              isRequired
              isInvalid={!!errors.password?.message}
              name="password"
              formLabelName={t('common.password')}
              value={value}
              handleInputChange={onChange}
              type="password"
              formHelperText={t('validations.passwordValidation')}
              formErrorMessage={errors.password?.message}
            />
          )}
        />
      </VStack>
      <VStack spacing={16} paddingTop={16}>
        <Button width={'100%'} onClick={handleSubmit(onSubmit)} isDisabled={isSubmitting}>
          {t('common.signIn')}
        </Button>
        <Link
          href={languagePathHelper(params.lang, FORGOT_PASSWORD_ROUTE)}
          as={NextLink}
          fontSize="16px"
          fontWeight="400"
          textDecorationLine="underline"
          textAlign="center">
          {t('common.forgotPassword')}
        </Link>
      </VStack>
    </AuthBox>
  );
};
export default SignIn;
