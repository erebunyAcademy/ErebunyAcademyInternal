'use client';
import { useLayoutEffect } from 'react';
import { Button, Link, useToast, VStack } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
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
import { ROUTE_DASHBOARD, ROUTE_FORGOT_PASSWORD, ROUTE_SIGN_IN } from '@/utils/constants/routes';
import { authBoxProps } from '@/utils/helpers/auth';
import { languagePathHelper } from '@/utils/helpers/language';
import { SignInFormValidation } from '@/utils/validation';

const resolver = classValidatorResolver(SignInFormValidation);

const SignIn = ({ params }: { params: { lang: Locale } }) => {
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignInFormValidation>({
    defaultValues: { email: '', password: '' },
    resolver,
  });

  const onSubmit: SubmitHandler<SignInFormValidation> = async ({ email, password }) => {
    try {
      const res: SignInResponse | undefined = await signIn('credentials', {
        email,
        password,
        callbackUrl: languagePathHelper(params.lang, ROUTE_DASHBOARD),
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
    onSuccess: () => router.replace(languagePathHelper(params.lang, ROUTE_SIGN_IN)),
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
          render={({ field: { onChange, value, name } }) => (
            <FormInput
              isRequired
              name={name}
              type="email"
              formLabelName={t('email')}
              value={value}
              isInvalid={!!errors.email?.message}
              handleInputChange={onChange}
              formErrorMessage={t(errors.email?.message)}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{ required: 'This field is required' }}
          render={({ field: { onChange, value, name }, fieldState: { error } }) => {
            console.log({ error });
            return (
              <FormInput
                isRequired
                name={name}
                formLabelName={t('password')}
                value={value}
                handleInputChange={onChange}
                type="password"
                formHelperText={t('passwordValidation')}
                isInvalid={!!errors.password?.message}
                formErrorMessage={t(errors.password?.message)}
              />
            );
          }}
        />
      </VStack>
      <VStack spacing={16} paddingTop={16}>
        <Button width={'100%'} onClick={handleSubmit(onSubmit)} isDisabled={!isValid}>
          {t('signIn')}
        </Button>
        <Link
          href={languagePathHelper(params.lang, ROUTE_FORGOT_PASSWORD)}
          as={NextLink}
          fontSize="16px"
          fontWeight="400"
          textDecorationLine="underline"
          textAlign="center">
          {t('forgotPassword')}
        </Link>
      </VStack>
    </AuthBox>
  );
};
export default SignIn;
