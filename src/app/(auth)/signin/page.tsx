'use client';
import { useLayoutEffect, useMemo } from 'react';
import { Link, useToast, VStack } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import NextLink from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, SignInResponse } from 'next-auth/react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { UserService } from '@/api/services/user.service';
import { Button, FormInput } from '@/components/atoms';
import { AuthBox } from '@/components/molecules';
import { ERROR_MESSAGES } from '@/utils/constants/common';
import {
  FORGOT_PASSWORD_ROUTE,
  PROFILE_ROUTE,
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
} from '@/utils/constants/routes';
import { SignInFormData } from '@/utils/models/auth';

const SignIn = () => {
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const authBoxProps = useMemo(
    () => ({
      data: [
        { href: SIGN_UP_ROUTE, title: 'Sign up' },
        { href: SIGN_IN_ROUTE, title: 'Sign In' },
      ],
      boxProps: { marginTop: { base: 64, md: 42 } },
    }),
    [],
  );

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
    <AuthBox data={authBoxProps.data} boxProps={authBoxProps.boxProps}>
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
              formLabelName="Email"
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
              formLabelName="Password"
              value={value}
              handleInputChange={onChange}
              type="password"
              formHelperText="Your password must not be less than 6 characters."
              formErrorMessage={errors.password?.message}
            />
          )}
        />
      </VStack>
      <VStack spacing={16} paddingTop={16}>
        <Button width={'100%'} onClick={handleSubmit(onSubmit)} isDisabled={isSubmitting}>
          Sign in
        </Button>
        <Link
          href={FORGOT_PASSWORD_ROUTE}
          as={NextLink}
          fontSize="16px"
          fontWeight="400"
          textDecorationLine="underline"
          textAlign="center">
          Forgot password?
        </Link>
      </VStack>
    </AuthBox>
  );
};
export default SignIn;
