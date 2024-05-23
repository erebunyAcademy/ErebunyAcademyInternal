import { memo, useCallback } from 'react';
import { Button, Text, VStack } from '@chakra-ui/react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { AuthService } from '@/api/services/auth.service';
import OTPPassword from '@/components/atoms/OTPPassword';
import { useAuth } from '@/contexts/AuthContext';
import { ForgotPasswordStep2Validation } from '@/utils/validation';

const resolver = classValidatorResolver(ForgotPasswordStep2Validation);

const Step2 = () => {
  const t = useTranslations();
  const { setStep, setConfirmationCode } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<ForgotPasswordStep2Validation>({
    resolver,
    defaultValues: { otpPassword: '' },
  });

  const { mutate, isPending } = useMutation<
    number,
    { message: string },
    ForgotPasswordStep2Validation
  >({
    mutationFn: AuthService.forgotPasswordStep2,
    onSuccess: res => {
      setConfirmationCode(res);
      setStep('passwordStep');
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordStep2Validation> = useCallback(
    data => {
      mutate(data);
    },
    [mutate],
  );

  return (
    <VStack spacing={32}>
      <Text fontWeight={'400'} fontSize={14} lineHeight={'normal'} textAlign={'center'}>
        {t('resetPasswordMail')}
      </Text>
      <Text fontWeight={'600'} fontSize={20} lineHeight={'normal'} textAlign={'center'}>
        {t('otpVerification')}
      </Text>
      <Controller
        name="otpPassword"
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field: { onChange, value } }) => (
          <OTPPassword onChange={onChange} value={value} />
        )}
      />
      <Button
        width={'100%'}
        onClick={handleSubmit(onSubmit)}
        isDisabled={!isValid}
        isLoading={isPending}>
        {t('next')}
      </Button>
    </VStack>
  );
};

export default memo(Step2);
