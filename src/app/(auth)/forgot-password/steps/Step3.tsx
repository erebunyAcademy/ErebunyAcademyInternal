'use client';
import { memo, useCallback } from 'react';
import { VStack } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { AuthService } from '@/api/services/AuthService';
import { Button, FormInput } from '@/components/atoms';
import { useAuth } from '@/contexts/AuthContext';
import { SIGN_IN_ROUTE } from '@/utils/constants/routes';
import { ForgotPasswordStep3Validation } from '@/utils/validation';

const resolver = classValidatorResolver(ForgotPasswordStep3Validation);

const Step3 = () => {
  const { confirmationCode } = useAuth();

  const { push } = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordStep3Validation>({
    defaultValues: { newPassword: '', confirmPassword: '', confirmationCode },
    resolver,
  });

  const { mutate, isLoading } = useMutation<
    boolean,
    { message: string },
    ForgotPasswordStep3Validation
  >(AuthService.forgotPasswordStep3, { onSuccess: () => push(SIGN_IN_ROUTE) });

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
            formLabelName="New password"
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
            formLabelName="Confirm password"
            value={value}
            handleInputChange={onChange}
            formErrorMessage={errors.confirmPassword?.message}
          />
        )}
      />
      <Button width={'100%'} onClick={handleSubmit(onSubmit)} isLoading={isLoading}>
        Verify
      </Button>
    </VStack>
  );
};

export default memo(Step3);
