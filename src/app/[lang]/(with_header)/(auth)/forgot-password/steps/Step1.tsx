'use client';
import { memo, useCallback } from 'react';
import { Button, VStack } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { AuthService } from '@/api/services/auth.service';
import { FormInput } from '@/components/atoms';
import { useAuth } from '@/contexts/AuthContext';
import { ForgotPasswordStep1Validation } from '@/utils/validation';

const resolver = classValidatorResolver(ForgotPasswordStep1Validation);

const Step1 = () => {
  const t = useTranslations();
  const { setStep } = useAuth();
  const {
    control,
    handleSubmit,

    formState: { errors, isValid },
  } = useForm<ForgotPasswordStep1Validation>({ defaultValues: { email: '' }, resolver });

  const { mutate, isPending } = useMutation<
    number,
    { message: string },
    ForgotPasswordStep1Validation
  >({
    mutationFn: AuthService.forgotPasswordStep1,
    onSuccess: () => {
      setStep('OTPStep');
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordStep1Validation> = useCallback(
    data => mutate(data),
    [mutate],
  );

  return (
    <VStack spacing={16}>
      <Controller
        name="email"
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field: { onChange, value } }) => (
          <FormInput
            isRequired
            isInvalid={!!errors.email?.message}
            name="email"
            type="email"
            formLabelName={t('email')}
            value={value}
            placeholder="you@example.com"
            handleInputChange={onChange}
            formErrorMessage={t(errors.email?.message)}
          />
        )}
      />
      <Button
        width={'100%'}
        onClick={handleSubmit(onSubmit)}
        isLoading={isPending}
        isDisabled={!isValid}>
        {t('next')}
      </Button>
    </VStack>
  );
};

export default memo(Step1);
