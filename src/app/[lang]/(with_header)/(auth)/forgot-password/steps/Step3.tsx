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
import { ROUTE_SIGN_IN } from '@/utils/constants/routes';
import { ForgotPasswordStep3Validation } from '@/utils/validation';
import { languagePathHelper } from '@/utils/helpers/language';
import { Locale } from '@/i18n';

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
        rules={{ required: 'This field is required' }}
        render={({ field: { onChange, value } }) => (
          <FormInput
            isRequired
            isInvalid={!!errors.newPassword?.message}
            name="newPassword"
            type="password"
            formLabelName={t('common.newPassword')}
            value={value}
            handleInputChange={onChange}
            formErrorMessage={errors.newPassword?.message}
          />
        )}
      />
      <Controller
        name="confirmPassword"
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field: { onChange, value } }) => (
          <FormInput
            isRequired
            isInvalid={!!errors.confirmPassword?.message}
            name="confirmPassword"
            type="password"
            formLabelName={t('common.confirmPassword')}
            value={value}
            handleInputChange={onChange}
            formErrorMessage={errors.confirmPassword?.message}
          />
        )}
      />
      <Button width={'100%'} onClick={handleSubmit(onSubmit)} isLoading={isPending}>
        {t('common.verify')}
      </Button>
    </VStack>
  );
};

export default memo(Step3);
