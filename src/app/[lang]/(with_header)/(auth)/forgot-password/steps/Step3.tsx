'use client';
import { memo, useCallback } from 'react';
import { Button, VStack } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { AuthService } from '@/api/services/auth.service';
import { FormInput } from '@/components/atoms';
import { useAuth } from '@/contexts/AuthContext';
import { Locale } from '@/i18n';
import { ROUTE_SIGN_IN } from '@/utils/constants/routes';
import { languagePathHelper } from '@/utils/helpers/language';
import { ForgotPasswordStep3Validation } from '@/utils/validation';

const resolver = classValidatorResolver(ForgotPasswordStep3Validation);

const Step3 = ({ lang }: { lang: Locale }) => {
  const { confirmationCode } = useAuth();
  const t = useTranslations();

  const { push } = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordStep3Validation>({
    defaultValues: { newPassword: '', confirmPassword: '', confirmationCode },
    resolver,
  });

  const { mutate, isPending } = useMutation<
    boolean,
    { message: string },
    ForgotPasswordStep3Validation
  >({
    mutationFn: AuthService.forgotPasswordStep3,
    onSuccess: () => push(languagePathHelper(lang, ROUTE_SIGN_IN)),
  });

  const onSubmit: SubmitHandler<ForgotPasswordStep3Validation> = useCallback(
    data => {
      mutate(data);
    },
    [mutate],
  );

  return (
    <VStack spacing={32}>
      <Controller
        name="newPassword"
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            isRequired
            name="newPassword"
            type="password"
            formLabelName={'newPassword'}
            value={value}
            handleInputChange={onChange}
            isInvalid={!!errors.newPassword?.message}
            formErrorMessage={errors.newPassword?.message}
          />
        )}
      />
      <Controller
        name="confirmPassword"
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormInput
            isRequired
            name="confirmPassword"
            type="password"
            formLabelName={'confirmPassword'}
            value={value}
            handleInputChange={onChange}
            isInvalid={!!errors.confirmPassword?.message}
            formErrorMessage={errors.confirmPassword?.message}
          />
        )}
      />
      <Button width={'100%'} onClick={handleSubmit(onSubmit)} isLoading={isPending}>
        {t('verify')}
      </Button>
    </VStack>
  );
};

export default memo(Step3);
