'use client';
import { useCallback, useEffect, useLayoutEffect } from 'react';
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

  const onSubmit = useCallback<SubmitHandler<SignInFormValidation>>(
    async ({ email, password }) => {
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
          toast({ title: t(res?.error?.split(': ')[1]), status: 'error' });
        }
      } catch (error) {
        toast({ title: t(ERROR_MESSAGES.invalidCredentials), status: 'error' });
      }
    },
    [params.lang, router, t, toast]
  );

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleSubmit(onSubmit)();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSubmit, onSubmit]);

  return (
    <AuthBox data={authBoxProps(params.lang).data} boxProps={authBoxProps(params.lang).boxProps}>
      <Loading isLoading={isSubmitting} />
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
              placeholder="mailPlaceholder"
              value={value}
              handleInputChange={onChange}
              isInvalid={!!errors.email?.message}
              formErrorMessage={errors.email?.message}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field: { onChange, value, name }, fieldState: { error } }) => {
            console.log({ error });
            return (
              <FormInput
                isRequired
                name={name}
                formLabelName={t('password')}
                placeholder="password"
                value={value}
                handleInputChange={onChange}
                type="password"
                formHelperText="passwordValidation"
                isInvalid={!!errors.password?.message}
                formErrorMessage={errors.password?.message}
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
